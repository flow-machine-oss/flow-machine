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
  type UpdateWorkflowDefinitionPayload,
  makeUpdateWorkflowDefinition,
} from "@/service/workflow/update-workflow-definition-service";

type UseUpdateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    UpdateWorkflowDefinitionPayload,
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
    mutationFn: makeUpdateWorkflowDefinition(httpClient),
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
