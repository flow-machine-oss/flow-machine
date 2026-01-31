import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";

export type DeleteAiAgentPayload = {
  params: IdParamsDto;
};

export const makeDeleteAiAgent =
  (httpClient: HttpClient) =>
  async ({ params }: DeleteAiAgentPayload) => {
    const response = await httpClient.delete<HttpEnvelope<undefined>>(
      `/api/v1/ai-agent/${params.id}`,
    );
    return response.data;
  };
