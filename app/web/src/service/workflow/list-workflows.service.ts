import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { WorkflowResponseDto } from "@/schema/workflow/workflow-service.schema";

export const makeListWorkflows = (httpClient: HttpClient) => async () => {
  const response =
    await httpClient.get<HttpEnvelope<WorkflowResponseDto[]>>(
      "/api/v1/workflow",
    );
  return response.data.data;
};
