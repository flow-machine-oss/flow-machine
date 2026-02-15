import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateWorkflowDefinitionServicePortIn } from "@/domain/port/workflow-definition/workflow-definition-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/frontend/http-client/workflow-definition/workflow-definition-http-client";
import {
  makeGetWorkflowDefinitionQueryKey,
  makeListWorkflowDefinitionsQueryKey,
} from "@/frontend/lib/query/query-key";

type UseUpdateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    void,
    Error,
    UpdateWorkflowDefinitionServicePortIn,
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
    mutationFn: async (input: UpdateWorkflowDefinitionServicePortIn) => {
      await makeWorkflowDefinitionHttpClient({ httpClient }).updateById(input);
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
