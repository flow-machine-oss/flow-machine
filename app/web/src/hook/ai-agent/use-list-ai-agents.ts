import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListAiAgentsQueryKey } from "@/lib/query/query-key";

type UseListAiAgentsOptions = Omit<
  UseQueryOptions<AiAgentDomain[], Error>,
  "queryKey" | "queryFn"
>;

export const useListAiAgents = (options?: UseListAiAgentsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListAiAgentsQueryKey(),
    queryFn: makeAiAgentHttpClient(httpClient).list,
    ...options,
  });
};
