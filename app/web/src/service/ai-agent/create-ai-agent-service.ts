import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { type CreateAiAgentRequestBodyDto } from "@/schema/ai-agent/create-ai-agent-service-schema";

export type CreateAiAgentPayload = {
  body: CreateAiAgentRequestBodyDto;
};

export const makeCreateAiAgent =
  (httpClient: HttpClient) =>
  async ({ body }: CreateAiAgentPayload) => {
    const response = await httpClient.post<HttpEnvelope<undefined>>(
      "/api/v1/ai-agent",
      body,
    );
    return response.data;
  };
