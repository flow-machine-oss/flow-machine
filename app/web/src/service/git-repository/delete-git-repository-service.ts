import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";

export type DeleteGitRepositoryPayload = {
  params: IdParamsDto;
};

export const makeDeleteGitRepository =
  (httpClient: HttpClient) =>
  async ({ params }: DeleteGitRepositoryPayload) => {
    const response = await httpClient.delete<HttpEnvelope<undefined>>(
      `/api/v1/git-repository/${params.id}`,
    );
    return response.data;
  };
