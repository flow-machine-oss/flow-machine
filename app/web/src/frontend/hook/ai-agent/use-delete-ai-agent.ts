import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DeleteAiAgentServicePortIn } from "@/domain/port/ai-agent/ai-agent-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeAiAgentHttpClient } from "@/frontend/http-client/ai-agent/ai-agent-http-client";
import {
  makeGetAiAgentQueryKey,
  makeListAiAgentsQueryKey,
} from "@/frontend/lib/query/query-key";

type UseDeleteAiAgentOptions = Omit<
  UseMutationOptions<void, Error, DeleteAiAgentServicePortIn, unknown>,
  "mutationFn"
>;

export const useDeleteAiAgent = (options?: UseDeleteAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteAiAgentServicePortIn) => {
      await makeAiAgentHttpClient({ httpClient }).deleteById(input);
    },
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
