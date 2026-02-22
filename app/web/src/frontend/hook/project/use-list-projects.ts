import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { ProjectDomain } from "@/domain/entity/project/project-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeProjectHttpClient } from "@/frontend/http-client/project/project-http-client";
import { makeListProjectsQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseListProjectsOptions = Omit<
  UseQueryOptions<HttpEnvelope<ProjectDomain[]>, Error, ProjectDomain[]>,
  "queryKey" | "queryFn"
>;

export const useListProjects = (options?: UseListProjectsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListProjectsQueryKey(),
    queryFn: () => makeProjectHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
