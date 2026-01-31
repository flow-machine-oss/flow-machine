import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";
import type { UpdateWorkflowDefinitionRequestBodyDto } from "@/schema/workflow/update-workflow-service.schema";

export type UpdateWorkflowPayload = {
  params: IdParamsDto;
  body: UpdateWorkflowDefinitionRequestBodyDto;
};

export const makeUpdateWorkflow =
  (httpClient: HttpClient) =>
  async ({ params, body }: UpdateWorkflowPayload) => {
    const response = await httpClient.patch<HttpEnvelope<undefined>>(
      `/api/v1/workflow/${params.id}`,
      body,
    );
    return response.data;
  };
