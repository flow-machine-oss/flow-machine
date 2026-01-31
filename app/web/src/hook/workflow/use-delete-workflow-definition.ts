import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import {
  makeGetWorkflowDefinitionQueryKey,
  makeListWorkflowDefinitionsQueryKey,
} from "@/lib/query/query-key";
import {
  type DeleteWorkflowDefinitionPayload,
  makeDeleteWorkflowDefinition,
} from "@/service/workflow/delete-workflow-definition-service";

type UseDeleteWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    DeleteWorkflowDefinitionPayload,
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
    mutationFn: makeDeleteWorkflowDefinition(httpClient),
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
