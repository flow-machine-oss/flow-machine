import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListWorkflowDefinitionsQueryKey } from "@/lib/query/query-key";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-definition-service-schema";
import { makeListWorkflowDefinitions } from "@/service/workflow/list-workflow-definitions-service";

type UseListWorkflowDefinitionsOptions = Omit<
  UseQueryOptions<WorkflowDefinitionResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useListWorkflowDefinitions = (
  options?: UseListWorkflowDefinitionsOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListWorkflowDefinitionsQueryKey(),
    queryFn: makeListWorkflowDefinitions(httpClient),
    ...options,
  });
};
