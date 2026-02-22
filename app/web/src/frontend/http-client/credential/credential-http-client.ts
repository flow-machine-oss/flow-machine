import { z } from "zod/v4";
import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { credentialDomainSchema } from "@/domain/entity/credential/credential-domain-schema";
import type {
  CreateCredentialServicePortIn,
  DeleteCredentialServicePortIn,
  GetCredentialServicePortIn,
  UpdateCredentialServicePortIn,
} from "@/domain/port/credential/credential-service-port";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/credential";

type MakeCredentialHttpClientIn = {
  httpClient: HttpClient;
};

export const makeCredentialHttpClient = ({
  httpClient,
}: MakeCredentialHttpClientIn) => ({
  create: async ({ body }: CreateCredentialServicePortIn) => {
    const response = await httpClient.post(BASE_PATH, body);
    const schema = withHttpEnvelopeSchema(z.void());
    return schema.parse(response.data);
  },

  deleteById: async ({ params }: DeleteCredentialServicePortIn) => {
    const response = await httpClient.delete(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(z.void());
    return schema.parse(response.data);
  },

  getById: async ({ params }: GetCredentialServicePortIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(credentialDomainSchema);
    return schema.parse(response.data);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(credentialDomainSchema.array());
    return schema.parse(response.data);
  },

  updateById: async ({ body, params }: UpdateCredentialServicePortIn) => {
    await httpClient.patch(`${BASE_PATH}/${params.id}`, body);
  },
});
