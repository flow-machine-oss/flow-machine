import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { AiAgentResponseDto } from "@/schema/ai-agent/ai-agent-service-schema";

export const makeListAiAgents = (httpClient: HttpClient) => async () => {
  const response =
    await httpClient.get<HttpEnvelope<AiAgentResponseDto[]>>(
      "/api/v1/ai-agent",
    );
  return response.data.data;
};
