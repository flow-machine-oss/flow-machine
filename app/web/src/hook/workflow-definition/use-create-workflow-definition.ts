import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import type { CreateWorkflowDefinitionHttpClientIn } from "@/backend/http-client/workflow-definition/workflow-definition-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListWorkflowDefinitionsQueryKey } from "@/lib/query/query-key";

type UseCreateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    void,
    Error,
    CreateWorkflowDefinitionHttpClientIn,
    unknown
  >,
  "mutationFn"
>;

export const useCreateWorkflowDefinition = (
  options?: UseCreateWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeWorkflowDefinitionHttpClient(httpClient).create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: makeListWorkflowDefinitionsQueryKey(),
      });
      options?.onSuccess?.(...args);
    },
  });
};
