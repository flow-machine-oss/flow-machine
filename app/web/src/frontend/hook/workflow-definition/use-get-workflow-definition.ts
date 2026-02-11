import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import { workflowDefinitionDomainCodec } from "@/backend/http-route-handler/workflow-definition/workflow-definition-route-handler-codec";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeGetWorkflowDefinitionQueryKey } from "@/lib/query/query-key";

type UseGetWorkflowDefinitionOptions = Omit<
  UseQueryOptions<WorkflowDefinitionDomain, Error>,
  "queryKey" | "queryFn"
>;

export const useGetWorkflowDefinition = (
  id: string,
  options?: UseGetWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetWorkflowDefinitionQueryKey(id),
    queryFn: async () => {
      const response = await makeWorkflowDefinitionHttpClient({
        httpClient,
      }).getById({ payload: { id } });
      return workflowDefinitionDomainCodec.decode(response.data);
    },
    ...options,
  });
};
