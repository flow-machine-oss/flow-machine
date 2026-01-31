import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeGetWorkflowDefinitionQueryKey } from "@/lib/query/query-key";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-definition-service-schema";
import { makeGetWorkflowDefinition } from "@/service/workflow/get-workflow-definition-service";

type UseGetWorkflowDefinitionOptions = Omit<
  UseQueryOptions<WorkflowDefinitionResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetWorkflowDefinition = (
  id: string,
  options?: UseGetWorkflowDefinitionOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetWorkflowDefinitionQueryKey(id),
    queryFn: () => makeGetWorkflowDefinition(httpClient)({ params: { id } }),
    ...options,
  });
};
