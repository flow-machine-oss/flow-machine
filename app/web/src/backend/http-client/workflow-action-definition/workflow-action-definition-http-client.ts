import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { workflowActionDefinitionHttpResponseDtoSchema } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client-dto";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/workflow-action-definition";

type MakeWorkflowActionDefinitionHttpClientIn = {
  httpClient: HttpClient;
};

export const makeWorkflowActionDefinitionHttpClient = ({
  httpClient,
}: MakeWorkflowActionDefinitionHttpClientIn) => ({
  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(
      workflowActionDefinitionHttpResponseDtoSchema.array(),
    );
    return schema.parse(response.data);
  },
});

export type WorkflowActionDefinitionHttpClient = ReturnType<
  typeof makeWorkflowActionDefinitionHttpClient
>;
