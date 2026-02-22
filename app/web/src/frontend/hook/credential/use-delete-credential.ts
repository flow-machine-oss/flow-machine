import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DeleteCredentialServicePortIn } from "@/domain/port/credential/credential-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeCredentialHttpClient } from "@/frontend/http-client/credential/credential-http-client";
import {
  makeGetCredentialQueryKey,
  makeListCredentialsQueryKey,
} from "@/frontend/lib/query/query-key";

type UseDeleteCredentialOptions = Omit<
  UseMutationOptions<void, Error, DeleteCredentialServicePortIn, unknown>,
  "mutationFn"
>;

export const useDeleteCredential = (options?: UseDeleteCredentialOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteCredentialServicePortIn) => {
      await makeCredentialHttpClient({ httpClient }).deleteById(input);
    },
    ...options,
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: makeListCredentialsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: makeGetCredentialQueryKey(variables.params.id),
      });
      options?.onSuccess?.(...args);
    },
  });
};
