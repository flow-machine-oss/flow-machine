import { z } from "zod/v4";
import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { workflowDefinitionDomainSchema } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import type {
  CreateWorkflowDefinitionServicePortIn,
  DeleteWorkflowDefinitionServicePortIn,
  GetWorkflowDefinitionServicePortIn,
  UpdateWorkflowDefinitionServicePortIn,
} from "@/domain/port/workflow-definition/workflow-definition-service-port";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/workflow-definition";

type MakeWorkflowDefinitionHttpClientIn = {
  httpClient: HttpClient;
};

export const makeWorkflowDefinitionHttpClient = ({
  httpClient,
}: MakeWorkflowDefinitionHttpClientIn) => ({
  create: async ({ body }: CreateWorkflowDefinitionServicePortIn) => {
    const response = await httpClient.post(BASE_PATH, body);
    const schema = withHttpEnvelopeSchema(workflowDefinitionDomainSchema);
    return schema.parse(response.data);
  },

  deleteById: async ({ params }: DeleteWorkflowDefinitionServicePortIn) => {
    const response = await httpClient.delete(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(z.void());
    return schema.parse(response.data);
  },

  getById: async ({ params }: GetWorkflowDefinitionServicePortIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(workflowDefinitionDomainSchema);
    return schema.parse(response.data);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(
      workflowDefinitionDomainSchema.array(),
    );
    return schema.parse(response.data);
  },

  updateById: async ({
    body,
    params,
  }: UpdateWorkflowDefinitionServicePortIn) => {
    await httpClient.patch(`${BASE_PATH}/${params.id}`, body);
  },
});
