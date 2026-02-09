import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import type { UpdateWorkflowDefinitionHttpClientIn } from "@/backend/http-client/workflow-definition/workflow-definition-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import {
  makeGetWorkflowDefinitionQueryKey,
  makeListWorkflowDefinitionsQueryKey,
} from "@/lib/query/query-key";

type UseUpdateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    void,
    Error,
    UpdateWorkflowDefinitionHttpClientIn,
    unknown
  >,
  "mutationFn"
>;

export const useUpdateWorkflowDefinition = (
  options?: UseUpdateWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeWorkflowDefinitionHttpClient(httpClient).updateById,
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: makeListWorkflowDefinitionsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: makeGetWorkflowDefinitionQueryKey(variables.payload.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
