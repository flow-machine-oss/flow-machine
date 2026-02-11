import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import type { DeleteWorkflowDefinitionClientIn } from "@/backend/http-client/workflow-definition/workflow-definition-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import {
  makeGetWorkflowDefinitionQueryKey,
  makeListWorkflowDefinitionsQueryKey,
} from "@/lib/query/query-key";

type UseDeleteWorkflowDefinitionOptions = Omit<
  UseMutationOptions<void, Error, DeleteWorkflowDefinitionClientIn, unknown>,
  "mutationFn"
>;

export const useDeleteWorkflowDefinition = (
  options?: UseDeleteWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteWorkflowDefinitionClientIn) => {
      await makeWorkflowDefinitionHttpClient({ httpClient }).deleteById(input);
    },
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
