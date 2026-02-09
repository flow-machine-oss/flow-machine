import { gitRepositoryHttpResponseDtoToDomainCodec } from "@/backend/http-client/git-repository/git-repository-http-client-codec";
import {
  type CreateGitRepositoryHttpClientIn,
  type DeleteGitRepositoryClientIn,
  type GetGitRepositoryByIdClientIn,
  type UpdateGitRepositoryHttpClientIn,
  gitRepositoryHttpResponseDtoSchema,
} from "@/backend/http-client/git-repository/git-repository-http-client-dto";
import { withHttpEnvelopeSchema } from "@/backend/http-client/shared-http-client-schema";
import type { HttpClient } from "@/lib/http/http-client";

const BASE_PATH = "/api/v1/git-repository";

export const makeGitRepositoryHttpClient = (httpClient: HttpClient) => ({
  create: async ({ payload }: CreateGitRepositoryHttpClientIn) => {
    await httpClient.post(BASE_PATH, payload);
  },

  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(
      gitRepositoryHttpResponseDtoSchema.array(),
    );
    const envelope = schema.parse(response.data);
    return envelope.data.map((item) =>
      gitRepositoryHttpResponseDtoToDomainCodec.decode(item),
    );
  },

  getById: async ({ payload }: GetGitRepositoryByIdClientIn) => {
    const response = await httpClient.get(`${BASE_PATH}/${payload.id}`);
    const schema = withHttpEnvelopeSchema(gitRepositoryHttpResponseDtoSchema);
    const envelope = schema.parse(response.data);
    return gitRepositoryHttpResponseDtoToDomainCodec.decode(envelope.data);
  },

  updateById: async ({ payload }: UpdateGitRepositoryHttpClientIn) => {
    await httpClient.patch(`${BASE_PATH}/${payload.id}`, payload.body);
  },

  deleteById: async ({ payload }: DeleteGitRepositoryClientIn) => {
    await httpClient.delete(`${BASE_PATH}/${payload.id}`);
  },
});
