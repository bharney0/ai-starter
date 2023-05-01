using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;
using MongoDB.Driver;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Azure;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AIStarter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private static readonly string DatabaseId = "azure-docs";
        private static readonly string ContainerId = "articles";
        private static readonly string searchUrl = "https://aistarter.search.windows.net/";
        private static readonly string indexName = "cosmosdb-index";
        private static readonly string openAIUrl = "https://aistarter.openai.azure.com/";
        private static readonly string deployment = "aistarter-gpt-35";

        private static MongoClient mongoClient;
        private static SearchClient searchClient;
        private static OpenAIClient openAIClient;

        private readonly ILogger<DocumentController> _logger;
        private readonly IConfiguration _configuration;

        public DocumentController(ILogger<DocumentController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [Route("ProvideCompletion")]
        [HttpPost]

        public async Task<string> ProvideCompletion(JsonDocument document)
        {
            try
            {
                var documents = await GetRelevantDocuments(document.metadata);
                var response = await AskPrompt(documents, document.content);
                return JsonSerializer.Serialize(response);
            }
            catch (Exception e)
            {
                return "";
            }

        }
        private static string GetFirst750Words(string input)
        {
            var words = input.Split(' ');
            var sb = new StringBuilder();
            for (int i = 0; i < Math.Min(words.Length, 750); i++)
            {
                sb.Append(words[i]);
                sb.Append(' ');
            }
            return sb.ToString();
        }

        private async Task<List<DocumentContainer>> GetRelevantDocuments(string metadata)
        {

            // create search from azure cognitive search using this url
            // https://aistarter.search.windows.net/indexes/cosmosdb-index/docs?api-version=2021-04-30-Preview&search=${metadata}
            // https://aistarter.search.windows.net/indexes/cosmosdb-index/docs?api-version=2021-04-30-Preview&search=${content}
            // https://aistarter.search.windows.net/indexes/cosmosdb-index/docs?api-version=2021-04-30-Preview&search=${metadata} ${content}
            Uri endpoint = new Uri(searchUrl);
            string key = _configuration["QueryKey"];
            // Create a client
            AzureKeyCredential credential = new AzureKeyCredential(key);
            searchClient = new SearchClient(endpoint, indexName, credential);

            var relevantDocuments = new List<string>();
            // Let's get the top 5 results related to the content
            SearchResults<SearchDocument> contentResponse = searchClient.Search<SearchDocument>(metadata, new SearchOptions { Size = 5 });
            foreach (SearchResult<SearchDocument> result in contentResponse.GetResults())
            {
                SearchDocument doc = result.Document;
                string FileName = (string)doc["FileName"];
                relevantDocuments.Add(FileName);
            }
            var documents = new List<DocumentContainer>();
            var settings = MongoClientSettings.FromUrl(new MongoUrl(_configuration["ConnectionString"]));
            settings.SslSettings = new SslSettings()
            {
                EnabledSslProtocols = SslProtocols.Tls12
            };

            mongoClient = new MongoClient(settings);
            var database = mongoClient.GetDatabase(DatabaseId);
            var container = database.GetCollection<DocumentContainer>(ContainerId);
            foreach (var fileName in relevantDocuments)
            {
                try
                {

                    // create a new FilterDefinition
                    var filter = Builders<DocumentContainer>.Filter.Eq("FileName", fileName);
                    var query = await container.FindAsync<DocumentContainer>(filter);
                    documents.Add(query.FirstOrDefault());
                }
                catch (Exception e)
                {
                }
            }
            return documents;
        }

        private async Task<string> AskPrompt(List<DocumentContainer> documents, string content)
        {
            // iterate through the documents and metadata
            var documentBuilder = new StringBuilder();
            var metadataBuilder = new StringBuilder();
            foreach (var document in documents)
            {
                documentBuilder.AppendLine($"{document.Document.Content}");
                metadataBuilder.AppendLine($"{document.Document.Metadata.Title}. {document.Document.Metadata.Description}");
            }
            // get just the first 750 words
            var documentString = GetFirst750Words(documentBuilder.ToString());
            var metadataString = GetFirst750Words(metadataBuilder.ToString());
            // build a prompt
            var summaryPrompt = $@"[Introduction]
The following is part of a technical article, focusing on {metadataString}.

[Context]
{documentString}

[Session]
Q: Summarize the technical article without changing the content, instead keep important sentences focusing on {metadataString}
A:";
            // with the documents we want to ask
            // Azure Open AI to parse out the most relevant sentences to the article
            openAIClient = new OpenAIClient(new Uri(openAIUrl), new AzureKeyCredential(_configuration["OpenAIKey"]));
            Completions summaryCompletionsResponse = await openAIClient.GetCompletionsAsync(deployment, summaryPrompt);
            string contextSummary = summaryCompletionsResponse.Choices.FirstOrDefault()!.Text;

            // now that we have the contextSummary we want to use that in the second prompt, but this time ask Azure Open AI to complete the article
            var prompt = $@"[Introduction]
You are a technical content author focusing on {metadataString}. You are trying to balance technicality and readability. Your writing should be engaging, relevant, and accurate.

[Context]
{contextSummary}

[Session]
Q: Using 2 sentences or less create original technical content focusing on {metadataString} This is what we have written so far:
{content}
A: ";
            Completions completionsResponse = await openAIClient.GetCompletionsAsync(deployment, prompt);
            string completion = completionsResponse.Choices.FirstOrDefault()!.Text;
            return completion;
        }

        //[HttpPost(Name = "CreateDocument")]
        //public async Task CreateDocumentAsync()
        //{
        //    Console.WriteLine("Starting...");
        //    var settings = MongoClientSettings.FromUrl(new MongoUrl(_configuration["ConnectionString"]));
        //    settings.SslSettings = new SslSettings()
        //    {
        //        EnabledSslProtocols = SslProtocols.Tls12
        //    };

        //    mongoClient = new MongoClient(settings);
        //    var database = mongoClient.GetDatabase(DatabaseId);
        //    var container = database.GetCollection<DocumentContainer>(ContainerId);

        //    var directoryPath = @"C:\Users\brharney\source\repos\azure-docs\articles\active-directory\app-provisioning";
        //    var files = Directory.GetFiles(directoryPath, "*.md", SearchOption.AllDirectories);

        //    foreach (var file in files)
        //    {
        //        try
        //        {
        //            Document Document = Document.FromFile(file);
        //            var fileName = Path.GetFileNameWithoutExtension(file);
        //            var id = Guid.NewGuid();
        //            var item = new DocumentContainer() { Id = id, FileName = fileName, Document = Document };
        //            await container.InsertOneAsync(item);
        //        }
        //        catch (Exception)
        //        {

        //            throw;
        //        }

        //    }

        //    Console.WriteLine("Done!");
        //}
    }
}