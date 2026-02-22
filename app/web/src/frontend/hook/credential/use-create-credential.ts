import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateCredentialServicePortIn } from "@/domain/port/credential/credential-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeCredentialHttpClient } from "@/frontend/http-client/credential/credential-http-client";
import { makeListCredentialsQueryKey } from "@/frontend/lib/query/query-key";

type UseCreateCredentialOptions = Omit<
  UseMutationOptions<void, Error, CreateCredentialServicePortIn, unknown>,
  "mutationFn"
>;

export const useCreateCredential = (options?: UseCreateCredentialOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCredentialServicePortIn) => {
      await makeCredentialHttpClient({ httpClient }).create(input);
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: makeListCredentialsQueryKey(),
      });
      options?.onSuccess?.(...args);
    },
  });
};
