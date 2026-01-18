import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { AiAgentResponseDto } from "@/schema/ai-agent/ai-agent-service.schema";
import type { IdParamsDto } from "@/schema/shared.schema";

export type GetAiAgentPayload = {
  params: IdParamsDto;
};

export const makeGetAiAgent =
  (httpClient: HttpClient) =>
  async ({ params }: GetAiAgentPayload) => {
    const response = await httpClient.get<HttpEnvelope<AiAgentResponseDto>>(
      `/api/v1/ai-agent/${params.id}`,
    );
    return response.data.data;
  };
