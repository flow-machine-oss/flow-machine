import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateProjectServicePortIn } from "@/domain/port/project/project-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeProjectHttpClient } from "@/frontend/http-client/project/project-http-client";
import { makeListProjectsQueryKey } from "@/frontend/lib/query/query-key";

type UseCreateProjectOptions = Omit<
  UseMutationOptions<void, Error, CreateProjectServicePortIn, unknown>,
  "mutationFn"
>;

export const useCreateProject = (options?: UseCreateProjectOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectServicePortIn) => {
      await makeProjectHttpClient({ httpClient }).create(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListProjectsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
