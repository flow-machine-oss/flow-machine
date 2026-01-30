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
  type UpdateWorkflowPayload,
  makeUpdateWorkflow,
} from "@/service/workflow/update-workflow.service";

type UseUpdateWorkflowOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    UpdateWorkflowPayload,
    unknown
  >,
  "mutationFn"
>;

export const useUpdateWorkflow = (options?: UseUpdateWorkflowOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeUpdateWorkflow(httpClient),
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
