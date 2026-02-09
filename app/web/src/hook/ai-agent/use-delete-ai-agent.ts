import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import type { DeleteAiAgentClientIn } from "@/backend/http-client/ai-agent/ai-agent-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import {
  makeGetAiAgentQueryKey,
  makeListAiAgentsQueryKey,
} from "@/lib/query/query-key";

type UseDeleteAiAgentOptions = Omit<
  UseMutationOptions<void, Error, DeleteAiAgentClientIn, unknown>,
  "mutationFn"
>;

export const useDeleteAiAgent = (options?: UseDeleteAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeAiAgentHttpClient(httpClient).deleteById,
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: makeGetAiAgentQueryKey(variables.payload.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
