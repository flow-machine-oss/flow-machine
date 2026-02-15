import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/frontend/http-client/workflow-definition/workflow-definition-http-client";
import { makeGetWorkflowDefinitionQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseGetWorkflowDefinitionOptions = Omit<
  UseQueryOptions<HttpEnvelope<WorkflowDefinitionDomain>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetWorkflowDefinition = (
  id: string,
  options?: UseGetWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetWorkflowDefinitionQueryKey(id),
    queryFn: () =>
      makeWorkflowDefinitionHttpClient({ httpClient }).getById({
        params: { id },
      }),
    ...options,
  });
};
