import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DeleteGitRepositoryServicePortIn } from "@/domain/port/git-repository/git-repository-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeGitRepositoryHttpClient } from "@/frontend/http-client/git-repository/git-repository-http-client";
import {
  makeGetGitRepositoryQueryKey,
  makeListGitRepositoriesQueryKey,
} from "@/frontend/lib/query/query-key";

type UseDeleteGitRepositoryOptions = Omit<
  UseMutationOptions<void, Error, DeleteGitRepositoryServicePortIn, unknown>,
  "mutationFn"
>;

export const useDeleteGitRepository = (
  options?: UseDeleteGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteGitRepositoryServicePortIn) => {
      await makeGitRepositoryHttpClient({ httpClient }).deleteById(input);
    },
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
