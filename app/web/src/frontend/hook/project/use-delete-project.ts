import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DeleteProjectServicePortIn } from "@/domain/port/project/project-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeProjectHttpClient } from "@/frontend/http-client/project/project-http-client";
import {
  makeGetProjectQueryKey,
  makeListProjectsQueryKey,
} from "@/frontend/lib/query/query-key";

type UseDeleteProjectOptions = Omit<
  UseMutationOptions<void, Error, DeleteProjectServicePortIn, unknown>,
  "mutationFn"
>;

export const useDeleteProject = (options?: UseDeleteProjectOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteProjectServicePortIn) => {
      await makeProjectHttpClient({ httpClient }).deleteById(input);
    },
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({ queryKey: makeListProjectsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: makeGetProjectQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
