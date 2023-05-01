using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace AIStarter
{
    public class Document
    {
        public Metadata Metadata { get; set; }
        public string Content { get; set; }

        public static Document FromFile(string filePath)
        {
            var text = File.ReadAllText(filePath);
            var regex = new Regex(@"^---(?<metadata>[\s\S]+?)---(?<content>[\s\S]+)", RegexOptions.Multiline);
            var match = regex.Match(text);

            if (!match.Success)
            {
                throw new Exception("Invalid markdown file format.");
            }

            

            var metadataText = match.Groups["metadata"].Value.Trim();
            var contentText = match.Groups["content"].Value.Trim();

            var deserializer = new DeserializerBuilder()
                .IgnoreUnmatchedProperties()
                .WithNamingConvention(UnderscoredNamingConvention.Instance)  // see height_in_inches in sample yml 
                .Build();
            var metadata = deserializer.Deserialize<Metadata>(metadataText);

            return new Document { Metadata = metadata, Content = contentText };
        }
    }

    public class Metadata
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] Tags { get; set; }
    }

    public class DocumentContainer
    {
        public Document Document { get; set; }
        public string FileName { get; set; }
        public Guid Id { get; set; }
    }
}