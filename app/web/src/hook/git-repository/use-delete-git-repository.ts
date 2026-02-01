import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import {
  makeGetGitRepositoryQueryKey,
  makeListGitRepositoriesQueryKey,
} from "@/lib/query/query-key";
import {
  type DeleteGitRepositoryPayload,
  makeDeleteGitRepository,
} from "@/service/git-repository/delete-git-repository-service";

type UseDeleteGitRepositoryOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    DeleteGitRepositoryPayload,
    unknown
  >,
  "mutationFn"
>;

export const useDeleteGitRepository = (
  options?: UseDeleteGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeDeleteGitRepository(httpClient),
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: makeListGitRepositoriesQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: makeGetGitRepositoryQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
