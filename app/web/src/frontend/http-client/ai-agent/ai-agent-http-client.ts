import { z } from "zod/v4";
import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import type {
  CreateAiAgentServicePortIn,
  DeleteAiAgentServicePortIn,
  GetAiAgentServicePortIn,
  UpdateAiAgentServicePortIn,
} from "@/domain/port/ai-agent/ai-agent-service-port";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/ai-agent";

type MakeAiAgentHttpClientIn = {
  httpClient: HttpClient;
};

export const makeAiAgentHttpClient = ({
  httpClient,
}: MakeAiAgentHttpClientIn) => ({
  create: async ({ body }: CreateAiAgentServicePortIn) => {
    const response = await httpClient.post(BASE_PATH, body);
    const schema = withHttpEnvelopeSchema(aiAgentDomainSchema);
    return schema.parse(response.data);
  },

  deleteById: async ({ params }: DeleteAiAgentServicePortIn) => {
    const response = await httpClient.delete(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(z.void());
    return schema.parse(response.data);
  },

  getById: async ({ params }: GetAiAgentServicePortIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(aiAgentDomainSchema);
    return schema.parse(response.data);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(aiAgentDomainSchema.array());
    return schema.parse(response.data);
  },

  updateById: async ({ body, params }: UpdateAiAgentServicePortIn) => {
    await httpClient.patch(`${BASE_PATH}/${params.id}`, body);
  },
});
