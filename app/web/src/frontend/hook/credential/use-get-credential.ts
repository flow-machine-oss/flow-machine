import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeCredentialHttpClient } from "@/frontend/http-client/credential/credential-http-client";
import { makeGetCredentialQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseGetCredentialOptions = Omit<
  UseQueryOptions<HttpEnvelope<CredentialDomain>, Error, CredentialDomain>,
  "queryKey" | "queryFn"
>;

export const useGetCredential = (
  id: string,
  options?: UseGetCredentialOptions,
) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeGetCredentialQueryKey(id),
    queryFn: () =>
      makeCredentialHttpClient({ httpClient }).getById({
        params: { id },
      }),
    select: (envelope) => envelope.data,
    ...options,
  });
};
