import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateCredentialServicePortIn } from "@/domain/port/credential/credential-service-port";
import { useProtectedHttpClient } from "@/frontend/hook/use-protected-http-client";
import { makeCredentialHttpClient } from "@/frontend/http-client/credential/credential-http-client";
import { makeListCredentialsQueryKey } from "@/frontend/lib/query/query-key";

type UseUpdateCredentialOptions = Omit<
  UseMutationOptions<void, Error, UpdateCredentialServicePortIn, unknown>,
  "mutationFn"
>;

export const useUpdateCredential = (options?: UseUpdateCredentialOptions) => {
  const httpClient = useProtectedHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCredentialServicePortIn) => {
      await makeCredentialHttpClient({ httpClient }).updateById(input);
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
