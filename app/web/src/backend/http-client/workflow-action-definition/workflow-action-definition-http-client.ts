import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { workflowActionDefinitionHttpResponseDtoToDomainCodec } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client-codec";
import { workflowActionDefinitionHttpResponseDtoSchema } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client-dto";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/workflow-action-definition";

export const makeWorkflowDefinitionHttpClient = (httpClient: HttpClient) => ({
  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(
      workflowActionDefinitionHttpResponseDtoSchema.array(),
    );
    const envelope = schema.parse(response.data);
    return envelope.data.map((item) =>
      workflowActionDefinitionHttpResponseDtoToDomainCodec.decode(item),
    );
  },
});
