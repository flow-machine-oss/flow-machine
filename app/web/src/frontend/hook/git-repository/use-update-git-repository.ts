import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateGitRepositoryServicePortIn } from "@/domain/port/git-repository/git-repository-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeGitRepositoryHttpClient } from "@/frontend/http-client/git-repository/git-repository-http-client";
import {
  makeGetGitRepositoryQueryKey,
  makeListGitRepositoriesQueryKey,
} from "@/frontend/lib/query/query-key";

type UseUpdateGitRepositoryOptions = Omit<
  UseMutationOptions<void, Error, UpdateGitRepositoryServicePortIn, unknown>,
  "mutationFn"
>;

export const useUpdateGitRepository = (
  options?: UseUpdateGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateGitRepositoryServicePortIn) => {
      await makeGitRepositoryHttpClient({ httpClient }).updateById(input);
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
