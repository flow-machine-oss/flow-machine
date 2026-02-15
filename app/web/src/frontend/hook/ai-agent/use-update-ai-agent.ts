import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateAiAgentServicePortIn } from "@/domain/port/ai-agent/ai-agent-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeAiAgentHttpClient } from "@/frontend/http-client/ai-agent/ai-agent-http-client";
import { makeListAiAgentsQueryKey } from "@/frontend/lib/query/query-key";

type UseUpdateAiAgentOptions = Omit<
  UseMutationOptions<void, Error, UpdateAiAgentServicePortIn, unknown>,
  "mutationFn"
>;

export const useUpdateAiAgent = (options?: UseUpdateAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAiAgentServicePortIn) => {
      await makeAiAgentHttpClient({ httpClient }).updateById(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
