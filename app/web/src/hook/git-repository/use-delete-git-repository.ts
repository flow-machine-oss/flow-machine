import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeGitRepositoryHttpClient } from "@/backend/http-client/git-repository/git-repository-http-client";
import type { DeleteGitRepositoryClientIn } from "@/backend/http-client/git-repository/git-repository-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import {
  makeGetGitRepositoryQueryKey,
  makeListGitRepositoriesQueryKey,
} from "@/lib/query/query-key";

type UseDeleteGitRepositoryOptions = Omit<
  UseMutationOptions<void, Error, DeleteGitRepositoryClientIn, unknown>,
  "mutationFn"
>;

export const useDeleteGitRepository = (
  options?: UseDeleteGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeGitRepositoryHttpClient(httpClient).deleteById,
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: makeListGitRepositoriesQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: makeGetGitRepositoryQueryKey(variables.payload.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
