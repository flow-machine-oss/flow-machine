import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeGitRepositoryHttpClient } from "@/frontend/http-client/git-repository/git-repository-http-client";
import { makeListGitRepositoriesQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseListGitRepositoriesOptions = Omit<
  UseQueryOptions<
    HttpEnvelope<GitRepositoryDomain[]>,
    Error,
    GitRepositoryDomain[]
  >,
  "queryKey" | "queryFn"
>;

export const useListGitRepositories = (
  options?: UseListGitRepositoriesOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListGitRepositoriesQueryKey(),
    queryFn: () => makeGitRepositoryHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
