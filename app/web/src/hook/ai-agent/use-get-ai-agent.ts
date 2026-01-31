import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeGetAiAgentQueryKey } from "@/lib/query/query-key";
import type { AiAgentResponseDto } from "@/schema/ai-agent/ai-agent-service-schema";
import { makeGetAiAgent } from "@/service/ai-agent/get-ai-agent-service";

type UseGetAiAgentOptions = Omit<
  UseQueryOptions<AiAgentResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetAiAgent = (id: string, options?: UseGetAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetAiAgentQueryKey(id),
    queryFn: () => makeGetAiAgent(httpClient)({ params: { id } }),
    ...options,
  });
};
