import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { makeListWorkflowsQueryKey } from "@/lib/query/query-key";
import {
  type CreateWorkflowPayload,
  makeCreateWorkflow,
} from "@/service/workflow/create-workflow.service";

type UseCreateWorkflowOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    CreateWorkflowPayload,
    unknown
  >,
  "mutationFn"
>;

export const useCreateWorkflow = (options?: UseCreateWorkflowOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeCreateWorkflow(httpClient),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListWorkflowsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
