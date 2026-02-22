import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateProjectServicePortIn } from "@/domain/port/project/project-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeProjectHttpClient } from "@/frontend/http-client/project/project-http-client";
import { makeListProjectsQueryKey } from "@/frontend/lib/query/query-key";

type UseUpdateProjectOptions = Omit<
  UseMutationOptions<void, Error, UpdateProjectServicePortIn, unknown>,
  "mutationFn"
>;

export const useUpdateProject = (options?: UseUpdateProjectOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProjectServicePortIn) => {
      await makeProjectHttpClient({ httpClient }).updateById(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListProjectsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
