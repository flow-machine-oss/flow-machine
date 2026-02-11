import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DeleteWorkflowDefinitionServicePortIn } from "@/domain/port/workflow-definition/workflow-definition-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/frontend/http-client/workflow-definition/workflow-definition-http-client";
import {
  makeGetWorkflowDefinitionQueryKey,
  makeListWorkflowDefinitionsQueryKey,
} from "@/frontend/lib/query/query-key";

type UseDeleteWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    void,
    Error,
    DeleteWorkflowDefinitionServicePortIn,
    unknown
  >,
  "mutationFn"
>;

export const useDeleteWorkflowDefinition = (
  options?: UseDeleteWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteWorkflowDefinitionServicePortIn) => {
      await makeWorkflowDefinitionHttpClient({ httpClient }).deleteById(input);
    },
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: makeListWorkflowDefinitionsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: makeGetWorkflowDefinitionQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
