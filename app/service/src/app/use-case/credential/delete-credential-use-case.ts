import { err, ok } from "neverthrow";
import type { DeleteCredentialRepository } from "@/domain/port/credential/credential-repository";
import {
  type DeleteCredentialUseCase,
  deleteCredentialUseCaseSchema,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  deleteCredentialRepository: DeleteCredentialRepository;
};

export const makeDeleteCredentialUseCase = ({
  deleteCredentialRepository,
}: Input): DeleteCredentialUseCase =>
  deleteCredentialUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteCredentialRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
