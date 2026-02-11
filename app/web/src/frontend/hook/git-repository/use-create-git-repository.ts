import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateGitRepositoryServicePortIn } from "@/domain/port/git-repository/git-repository-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeGitRepositoryHttpClient } from "@/frontend/http-client/git-repository/git-repository-http-client";
import { makeListGitRepositoriesQueryKey } from "@/frontend/lib/query/query-key";

type UseCreateGitRepositoryOptions = Omit<
  UseMutationOptions<void, Error, CreateGitRepositoryServicePortIn, unknown>,
  "mutationFn"
>;

export const useCreateGitRepository = (
  options?: UseCreateGitRepositoryOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGitRepositoryServicePortIn) => {
      await makeGitRepositoryHttpClient({ httpClient }).create(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: makeListGitRepositoriesQueryKey(),
      });
      options?.onSuccess?.(...args);
    },
  });
};
