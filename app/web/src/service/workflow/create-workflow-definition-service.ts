import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { type CreateWorkflowDefinitionRequestBodyDto } from "@/schema/workflow/create-workflow-definition-service-schema";

export type CreateWorkflowDefinitionPayload = {
  body: CreateWorkflowDefinitionRequestBodyDto;
};

export const makeCreateWorkflowDefinition =
  (httpClient: HttpClient) =>
  async ({ body }: CreateWorkflowDefinitionPayload) => {
    const response = await httpClient.post<HttpEnvelope<undefined>>(
      "/api/v1/workflow-definition",
      body,
    );
    return response.data;
  };
