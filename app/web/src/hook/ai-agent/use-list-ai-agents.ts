import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListAiAgentsQueryKey } from "@/lib/query/query-key";
import type { AiAgentResponseDto } from "@/schema/ai-agent/ai-agent-service.schema";
import { makeListAiAgents } from "@/service/ai-agent/list-ai-agents.service";

type UseListAiAgentsOptions = Omit<
  UseQueryOptions<AiAgentResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useListAiAgents = (options?: UseListAiAgentsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListAiAgentsQueryKey(),
    queryFn: makeListAiAgents(httpClient),
    ...options,
  });
};
