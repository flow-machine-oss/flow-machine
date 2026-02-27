import { z } from "zod/v4";
import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import { gitRepositoryDomainSchema } from "@/domain/entity/git-repository/git-repository-domain-schema";
import type {
  CreateGitRepositoryServicePortIn,
  DeleteGitRepositoryServicePortIn,
  GetGitRepositoryServicePortIn,
  UpdateGitRepositoryServicePortIn,
} from "@/domain/port/git-repository/git-repository-service-port";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/git-repository";

type MakeGitRepositoryHttpClientIn = {
  httpClient: HttpClient;
};

export const makeGitRepositoryHttpClient = ({
  httpClient,
}: MakeGitRepositoryHttpClientIn) => ({
  create: async ({ body }: CreateGitRepositoryServicePortIn) => {
    const response = await httpClient.post(BASE_PATH, body);
    const schema = withHttpEnvelopeSchema(gitRepositoryDomainSchema);
    return schema.parse(response.data);
  },

  deleteById: async ({ params }: DeleteGitRepositoryServicePortIn) => {
    const response = await httpClient.delete(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(z.void());
    return schema.parse(response.data);
  },

  getById: async ({ params }: GetGitRepositoryServicePortIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${params.id}`);
    const schema = withHttpEnvelopeSchema(gitRepositoryDomainSchema);
    return schema.parse(response.data);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(gitRepositoryDomainSchema.array());
    return schema.parse(response.data);
  },

  updateById: async ({ body, params }: UpdateGitRepositoryServicePortIn) => {
    await httpClient.patch(`${BASE_PATH}/${params.id}`, body);
  },
});
