import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import { makeListAiAgentsQueryKey } from "@/lib/query/query-key";
import {
  type CreateAiAgentPayload,
  makeCreateAiAgent,
} from "@/service/ai-agent/create-ai-agent-service";

type UseCreateAiAgentOptions = Omit<
  UseMutationOptions<
    HttpEnvelope<undefined>,
    Error,
    CreateAiAgentPayload,
    unknown
  >,
  "mutationFn"
>;

export const useCreateAiAgent = (options?: UseCreateAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeCreateAiAgent(httpClient),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: makeListAiAgentsQueryKey() });
      options?.onSuccess?.(...args);
    },
  });
};
