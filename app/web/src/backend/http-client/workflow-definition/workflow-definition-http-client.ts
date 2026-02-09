import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { workflowDefinitionHttpResponseDtoToDomainCodec } from "@/backend/http-client/workflow-definition/workflow-definition-http-client-codec";
import {
  type CreateWorkflowDefinitionHttpClientIn,
  type DeleteWorkflowDefinitionClientIn,
  type GetWorkflowDefinitionByIdClientIn,
  type UpdateWorkflowDefinitionHttpClientIn,
  workflowDefinitionHttpResponseDtoSchema,
} from "@/backend/http-client/workflow-definition/workflow-definition-http-client-dto";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/workflow-definition";

export const makeWorkflowDefinitionHttpClient = (httpClient: HttpClient) => ({
  create: async ({ payload }: CreateWorkflowDefinitionHttpClientIn) => {
    await httpClient.post(BASE_PATH, payload);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(
      workflowDefinitionHttpResponseDtoSchema.array(),
    );
    const envelope = schema.parse(response.data);
    return envelope.data.map((item) =>
      workflowDefinitionHttpResponseDtoToDomainCodec.decode(item),
    );
  },

  getById: async ({ payload }: GetWorkflowDefinitionByIdClientIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${payload.id}`);
    const schema = withHttpEnvelopeSchema(
      workflowDefinitionHttpResponseDtoSchema,
    );
    const envelope = schema.parse(response.data);
    return workflowDefinitionHttpResponseDtoToDomainCodec.decode(envelope.data);
  },

  updateById: async ({ payload }: UpdateWorkflowDefinitionHttpClientIn) => {
    await httpClient.patch(`${BASE_PATH}/${payload.id}`, payload.body);
  },

  deleteById: async ({ payload }: DeleteWorkflowDefinitionClientIn) => {
    await httpClient.delete(`${BASE_PATH}/${payload.id}`);
  },
});
