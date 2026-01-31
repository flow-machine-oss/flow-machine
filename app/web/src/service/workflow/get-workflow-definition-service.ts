import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-definition-service-schema";

export type GetWorkflowDefinitionPayload = {
  params: IdParamsDto;
};

export const makeGetWorkflowDefinition =
  (httpClient: HttpClient) =>
  async ({ params }: GetWorkflowDefinitionPayload) => {
    const response = await httpClient.get<
      HttpEnvelope<WorkflowDefinitionResponseDto>
    >(`/api/v1/workflow-definition/${params.id}`);
    return response.data.data;
  };
