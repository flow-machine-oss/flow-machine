import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeGetWorkflowQueryKey } from "@/lib/query/query-key";
import type { WorkflowDefinitionResponseDto } from "@/schema/workflow/workflow-service.schema";
import { makeGetWorkflow } from "@/service/workflow/get-workflow.service";

type UseGetWorkflowOptions = Omit<
  UseQueryOptions<WorkflowDefinitionResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetWorkflow = (id: string, options?: UseGetWorkflowOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetWorkflowQueryKey(id),
    queryFn: () => makeGetWorkflow(httpClient)({ params: { id } }),
    ...options,
  });
};
