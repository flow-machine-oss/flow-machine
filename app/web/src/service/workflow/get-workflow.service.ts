import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { WorkflowResponseDto } from "@/schema/workflow/workflow-service.schema";
import type { IdParamsDto } from "@/schema/shared.schema";

export type GetWorkflowPayload = {
  params: IdParamsDto;
};

export const makeGetWorkflow =
  (httpClient: HttpClient) =>
  async ({ params }: GetWorkflowPayload) => {
    const response = await httpClient.get<HttpEnvelope<WorkflowResponseDto>>(
      `/api/v1/workflow/${params.id}`,
    );
    return response.data.data;
  };
