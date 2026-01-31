import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-service.schema";

export type GetWorkflowPayload = {
  params: IdParamsDto;
};

export const makeGetWorkflow =
  (httpClient: HttpClient) =>
  async ({ params }: GetWorkflowPayload) => {
    const response = await httpClient.get<
      HttpEnvelope<WorkflowDefinitionResponseDto>
    >(`/api/v1/workflow/${params.id}`);
    return response.data.data;
  };
