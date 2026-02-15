import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/frontend/http-client/workflow-definition/workflow-definition-http-client";
import { makeListWorkflowDefinitionsQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseListWorkflowDefinitionsOptions = Omit<
  UseQueryOptions<
    HttpEnvelope<WorkflowDefinitionDomain[]>,
    Error,
    WorkflowDefinitionDomain[]
  >,
  "queryKey" | "queryFn"
>;

export const useListWorkflowDefinitions = (
  options?: UseListWorkflowDefinitionsOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListWorkflowDefinitionsQueryKey(),
    queryFn: () => makeWorkflowDefinitionHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
