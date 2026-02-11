import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateAiAgentServicePortIn } from "@/domain/port/ai-agent/ai-agent-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeAiAgentHttpClient } from "@/frontend/http-client/ai-agent/ai-agent-http-client";
import { makeListAiAgentsQueryKey } from "@/frontend/lib/query/query-key";

type UseCreateAiAgentOptions = Omit<
  UseMutationOptions<void, Error, CreateAiAgentServicePortIn, unknown>,
  "mutationFn"
>;

export const useCreateAiAgent = (options?: UseCreateAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAiAgentServicePortIn) => {
      await makeAiAgentHttpClient({ httpClient }).create(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
