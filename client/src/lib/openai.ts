import { apiRequest } from "./queryClient";

interface ChatRequest {
  question: string;
}

interface ChatResponse {
  answer: string;
}

export async function sendChatRequest(question: string): Promise<ChatResponse> {
  try {
    const response = await apiRequest("POST", "/api/chat", { question });
    return await response.json();
  } catch (error) {
    console.error("Error sending chat request:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}
