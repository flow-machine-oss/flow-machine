import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";

export type DeleteWorkflowDefinitionPayload = {
  params: IdParamsDto;
};

export const makeDeleteWorkflowDefinition =
  (httpClient: HttpClient) =>
  async ({ params }: DeleteWorkflowDefinitionPayload) => {
    const response = await httpClient.delete<HttpEnvelope<undefined>>(
      `/api/v1/workflow-definition/${params.id}`,
    );
    return response.data;
  };
