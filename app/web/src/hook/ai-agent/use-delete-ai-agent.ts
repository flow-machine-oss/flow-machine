import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import {
  makeGetAiAgentQueryKey,
  makeListAiAgentsQueryKey,
} from "@/lib/query/query-key";
import {
  type DeleteAiAgentPayload,
  makeDeleteAiAgent,
} from "@/service/ai-agent/delete-ai-agent-service";

type UseDeleteAiAgentOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    DeleteAiAgentPayload,
    unknown
  >,
  "mutationFn"
>;

export const useDeleteAiAgent = (options?: UseDeleteAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeDeleteAiAgent(httpClient),
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: makeGetAiAgentQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
