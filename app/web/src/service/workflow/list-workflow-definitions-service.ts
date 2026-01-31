import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-definition-service-schema";

export const makeListWorkflowDefinitions =
  (httpClient: HttpClient) => async () => {
    const response = await httpClient.get<
      HttpEnvelope<WorkflowDefinitionResponseDto[]>
    >("/api/v1/workflow-definition");
    return response.data.data;
  };
