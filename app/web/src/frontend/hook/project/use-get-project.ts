import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { ProjectDomain } from "@/domain/entity/project/project-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeProjectHttpClient } from "@/frontend/http-client/project/project-http-client";
import { makeGetProjectQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseGetProjectOptions = Omit<
  UseQueryOptions<HttpEnvelope<ProjectDomain>, Error, ProjectDomain>,
  "queryKey" | "queryFn"
>;

export const useGetProject = (id: string, options?: UseGetProjectOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetProjectQueryKey(id),
    queryFn: () =>
      makeProjectHttpClient({ httpClient }).getById({
        params: { id },
      }),
    select: (envelope) => envelope.data,
    ...options,
  });
};
