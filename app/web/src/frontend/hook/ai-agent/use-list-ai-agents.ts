import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeAiAgentHttpClient } from "@/frontend/http-client/ai-agent/ai-agent-http-client";
import { makeListAiAgentsQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseListAiAgentsOptions = Omit<
  UseQueryOptions<HttpEnvelope<AiAgentDomain[]>, Error, AiAgentDomain[]>,
  "queryKey" | "queryFn"
>;

export const useListAiAgents = (options?: UseListAiAgentsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListAiAgentsQueryKey(),
    queryFn: ({}) => makeAiAgentHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
