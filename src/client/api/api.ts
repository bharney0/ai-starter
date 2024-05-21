const BACKEND_URI = "http://localhost:7098/";

import { ChatAppResponse, ChatAppResponseOrError, ChatAppRequest, Config, SimpleAPIResponse } from "./models";
import { useLogin } from "../auth/authConfig";

export function getHeaders(idToken: string | undefined): Record<string, string> {
    // If using login and not using app services, add the id token of the logged in account as the authorization
    if (useLogin) {
        if (idToken) {
            return { Authorization: `Bearer ${idToken}` };
        }
    }

    return {};
}

export async function configApi() {
    const config = {
			CONFIG_OPENAI_TOKEN: "openai_token",
			CONFIG_CREDENTIAL: "azure_credential",
			CONFIG_ASK_APPROACH: "ask_approach",
			CONFIG_ASK_VISION_APPROACH: "ask_vision_approach",
			CONFIG_CHAT_VISION_APPROACH: "chat_vision_approach",
			CONFIG_CHAT_APPROACH: "chat_approach",
			CONFIG_BLOB_CONTAINER_CLIENT: "blob_container_client",
			CONFIG_USER_UPLOAD_ENABLED: "user_upload_enabled",
			CONFIG_USER_BLOB_CONTAINER_CLIENT: "user_blob_container_client",
			CONFIG_AUTH_CLIENT: "auth_client",
			CONFIG_GPT4V_DEPLOYED: "gpt4v_deployed",
			CONFIG_SEMANTIC_RANKER_DEPLOYED: "semantic_ranker_deployed",
			CONFIG_VECTOR_SEARCH_ENABLED: "vector_search_enabled",
			CONFIG_SEARCH_CLIENT: "search_client",
			CONFIG_OPENAI_CLIENT: "openai_client",
			CONFIG_INGESTER: "ingester"
		}

    return config;
}

export async function askApi(request: ChatAppRequest, idToken: string | undefined): Promise<ChatAppResponse> {
    const response = await fetch(`${BACKEND_URI}/ProvideCompletion`, {
        method: "POST",
        headers: { ...getHeaders(idToken), "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });

    const parsedResponse: ChatAppResponseOrError = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse as ChatAppResponse;
}

export async function chatApi(request: ChatAppRequest, idToken: string | undefined): Promise<Response> {
    return await fetch(`${BACKEND_URI}/chat`, {
        method: "POST",
        headers: { ...getHeaders(idToken), "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });
}

export function getCitationFilePath(citation: string): string {
    return `${BACKEND_URI}/content/${citation}`;
}

export async function uploadFileApi(request: FormData, idToken: string): Promise<SimpleAPIResponse> {
    const response = await fetch("/upload", {
        method: "POST",
        headers: getHeaders(idToken),
        body: request
    });

    if (!response.ok) {
        throw new Error(`Uploading files failed: ${response.statusText}`);
    }

    const dataResponse: SimpleAPIResponse = await response.json();
    return dataResponse;
}

export async function deleteUploadedFileApi(filename: string, idToken: string): Promise<SimpleAPIResponse> {
    const response = await fetch("/delete_uploaded", {
        method: "POST",
        headers: { ...getHeaders(idToken), "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
    });

    if (!response.ok) {
        throw new Error(`Deleting file failed: ${response.statusText}`);
    }

    const dataResponse: SimpleAPIResponse = await response.json();
    return dataResponse;
}

export async function listUploadedFilesApi(idToken: string): Promise<string[]> {
    const response = await fetch(`/list_uploaded`, {
        method: "GET",
        headers: getHeaders(idToken)
    });

    if (!response.ok) {
        throw new Error(`Listing files failed: ${response.statusText}`);
    }

    const dataResponse: string[] = await response.json();
    return dataResponse;
}
