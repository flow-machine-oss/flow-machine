import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeAiAgentHttpClient } from "@/frontend/http-client/ai-agent/ai-agent-http-client";
import { makeGetAiAgentQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseGetAiAgentOptions = Omit<
  UseQueryOptions<HttpEnvelope<AiAgentDomain>, Error, AiAgentDomain>,
  "queryKey" | "queryFn"
>;

export const useGetAiAgent = (id: string, options?: UseGetAiAgentOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetAiAgentQueryKey(id),
    queryFn: () =>
      makeAiAgentHttpClient({ httpClient }).getById({
        params: { id },
      }),
    select: (envelope) => envelope.data,
    ...options,
  });
};
