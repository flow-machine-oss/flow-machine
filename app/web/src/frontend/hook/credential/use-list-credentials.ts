import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeCredentialHttpClient } from "@/frontend/http-client/credential/credential-http-client";
import { makeListCredentialsQueryKey } from "@/frontend/lib/query/query-key";
import type { HttpEnvelope } from "@/lib/http/http-schema";

type UseListCredentialsOptions = Omit<
  UseQueryOptions<HttpEnvelope<CredentialDomain[]>, Error, CredentialDomain[]>,
  "queryKey" | "queryFn"
>;

export const useListCredentials = (options?: UseListCredentialsOptions) => {
  const httpClient = useProtectedHttpClient();

  return useQuery({
    queryKey: makeListCredentialsQueryKey(),
    queryFn: () => makeCredentialHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
