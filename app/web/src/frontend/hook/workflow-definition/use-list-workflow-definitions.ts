import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import { workflowDefinitionDomainCodec } from "@/backend/http-route-handler/workflow-definition/workflow-definition-route-handler-codec";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListWorkflowDefinitionsQueryKey } from "@/lib/query/query-key";

type UseListWorkflowDefinitionsOptions = Omit<
  UseQueryOptions<WorkflowDefinitionDomain[], Error>,
  "queryKey" | "queryFn"
>;

export const useListWorkflowDefinitions = (
  options?: UseListWorkflowDefinitionsOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListWorkflowDefinitionsQueryKey(),
    queryFn: async () => {
      const response = await makeWorkflowDefinitionHttpClient({
        httpClient,
      }).list();
      return response.data.map((item) =>
        workflowDefinitionDomainCodec.decode(item),
      );
    },
    ...options,
  });
};
