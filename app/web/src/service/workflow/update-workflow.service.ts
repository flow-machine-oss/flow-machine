import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { UpdateWorkflowRequestBodyDto } from "@/schema/workflow/update-workflow-service.schema";
import type { IdParamsDto } from "@/schema/shared.schema";

export type UpdateWorkflowPayload = {
  params: IdParamsDto;
  body: UpdateWorkflowRequestBodyDto;
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
