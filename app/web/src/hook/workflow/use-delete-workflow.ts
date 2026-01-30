import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import {
  makeGetWorkflowQueryKey,
  makeListWorkflowsQueryKey,
} from "@/lib/query/query-key";
import {
  type DeleteWorkflowPayload,
  makeDeleteWorkflow,
} from "@/service/workflow/delete-workflow.service";

type UseDeleteWorkflowOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    DeleteWorkflowPayload,
    unknown
  >,
  "mutationFn"
>;

export const useDeleteWorkflow = (options?: UseDeleteWorkflowOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeDeleteWorkflow(httpClient),
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({ queryKey: makeListWorkflowsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: makeGetWorkflowQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
