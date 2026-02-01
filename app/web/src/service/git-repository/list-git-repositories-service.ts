import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { GitRepositoryResponseDto } from "@/schema/git-repository/git-repository-service-schema";

export const makeListGitRepositories =
  (httpClient: HttpClient) => async () => {
    const response = await httpClient.get<
      HttpEnvelope<GitRepositoryResponseDto[]>
    >("/api/v1/git-repository");
    return response.data.data;
  };
