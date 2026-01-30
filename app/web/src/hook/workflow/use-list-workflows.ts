import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useProtectedHttpClient } from "@/hook/use-protected-http-client";
import { makeListWorkflowsQueryKey } from "@/lib/query/query-key";
import type { WorkflowResponseDto } from "@/schema/workflow/workflow-service.schema";
import { makeListWorkflows } from "@/service/workflow/list-workflows.service";

type UseListWorkflowsOptions = Omit<
  UseQueryOptions<WorkflowResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useListWorkflows = (options?: UseListWorkflowsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListWorkflowsQueryKey(),
    queryFn: makeListWorkflows(httpClient),
    ...options,
  });
};
