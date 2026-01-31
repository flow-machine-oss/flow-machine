import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";
import type { UpdateWorkflowDefinitionRequestBodyDto } from "@/schema/workflow/update-workflow-definition-service-schema";

export type UpdateWorkflowDefinitionPayload = {
  params: IdParamsDto;
  body: UpdateWorkflowDefinitionRequestBodyDto;
};

export const makeUpdateWorkflowDefinition =
  (httpClient: HttpClient) =>
  async ({ params, body }: UpdateWorkflowDefinitionPayload) => {
    const response = await httpClient.patch<HttpEnvelope<undefined>>(
      `/api/v1/workflow-definition/${params.id}`,
      body,
    );
    return response.data;
  };
