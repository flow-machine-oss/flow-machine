import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { type CreateWorkflowRequestBodyDto } from "@/schema/workflow/create-workflow-service.schema";

export type CreateWorkflowPayload = {
  body: CreateWorkflowRequestBodyDto;
};

export const makeCreateWorkflow =
  (httpClient: HttpClient) =>
  async ({ body }: CreateWorkflowPayload) => {
    const response = await httpClient.post<HttpEnvelope<undefined>>(
      "/api/v1/workflow",
      body,
    );
    return response.data;
  };
