import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { makeListWorkflowDefinitionsQueryKey } from "@/lib/query/query-key";
import {
  type CreateWorkflowDefinitionPayload,
  makeCreateWorkflowDefinition,
} from "@/service/workflow/create-workflow-definition-service";

type UseCreateWorkflowDefinitionOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    CreateWorkflowDefinitionPayload,
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
    mutationFn: makeCreateWorkflowDefinition(httpClient),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: makeListWorkflowDefinitionsQueryKey(),
      });
      options?.onSuccess?.(...args);
    },
  });
};
