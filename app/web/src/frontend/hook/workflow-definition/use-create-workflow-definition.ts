import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateWorkflowDefinitionServicePortIn } from "@/domain/port/workflow-definition/workflow-definition-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/frontend/http-client/workflow-definition/workflow-definition-http-client";
import { makeListWorkflowDefinitionsQueryKey } from "@/frontend/lib/query/query-key";

type UseCreateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    void,
    Error,
    CreateWorkflowDefinitionServicePortIn,
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
    mutationFn: async (input: CreateWorkflowDefinitionServicePortIn) => {
      await makeWorkflowDefinitionHttpClient({ httpClient }).create(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: makeListWorkflowDefinitionsQueryKey(),
      });
      options?.onSuccess?.(...args);
    },
  });
};
