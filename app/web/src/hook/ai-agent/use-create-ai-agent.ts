import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import type { CreateAiAgentHttpClientIn } from "@/backend/http-client/ai-agent/ai-agent-http-client-dto";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListAiAgentsQueryKey } from "@/lib/query/query-key";

type UseCreateAiAgentOptions = Omit<
  UseMutationOptions<void, Error, CreateAiAgentHttpClientIn, unknown>,
  "mutationFn"
>;

export const useCreateAiAgent = (options?: UseCreateAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeAiAgentHttpClient(httpClient).create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
