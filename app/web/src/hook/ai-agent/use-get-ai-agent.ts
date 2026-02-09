import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeGetAiAgentQueryKey } from "@/lib/query/query-key";

type UseGetAiAgentOptions = Omit<
  UseQueryOptions<AiAgentDomain, Error>,
  "queryKey" | "queryFn"
>;

export const useGetAiAgent = (id: string, options?: UseGetAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetAiAgentQueryKey(id),
    queryFn: () =>
      makeAiAgentHttpClient(httpClient).getById({ payload: { id } }),
    ...options,
  });
};
