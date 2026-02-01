import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListGitRepositoriesQueryKey } from "@/lib/query/query-key";
import type { GitRepositoryResponseDto } from "@/schema/git-repository/git-repository-service-schema";
import { makeListGitRepositories } from "@/service/git-repository/list-git-repositories-service";

type UseListGitRepositoriesOptions = Omit<
  UseQueryOptions<GitRepositoryResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useListGitRepositories = (
  options?: UseListGitRepositoriesOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListGitRepositoriesQueryKey(),
    queryFn: makeListGitRepositories(httpClient),
    ...options,
  });
};
