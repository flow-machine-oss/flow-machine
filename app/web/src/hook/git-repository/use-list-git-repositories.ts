import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { makeGitRepositoryHttpClient } from "@/backend/http-client/git-repository/git-repository-http-client";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListGitRepositoriesQueryKey } from "@/lib/query/query-key";

type UseListGitRepositoriesOptions = Omit<
  UseQueryOptions<GitRepositoryDomain[], Error>,
  "queryKey" | "queryFn"
>;

export const useListGitRepositories = (
  options?: UseListGitRepositoriesOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListGitRepositoriesQueryKey(),
    queryFn: makeGitRepositoryHttpClient(httpClient).list,
    ...options,
  });
};
