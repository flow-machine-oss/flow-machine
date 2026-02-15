import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeGitRepositoryHttpClient } from "@/frontend/http-client/git-repository/git-repository-http-client";
import { makeGetGitRepositoryQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseGetGitRepositoryOptions = Omit<
  UseQueryOptions<HttpEnvelope<GitRepositoryDomain>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetGitRepository = (
  id: string,
  options?: UseGetGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetGitRepositoryQueryKey(id),
    queryFn: () =>
      makeGitRepositoryHttpClient({ httpClient }).getById({
        params: { id },
      }),
    ...options,
  });
};
