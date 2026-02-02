import { err, ok } from "neverthrow";
import type { UpdateCredentialRepository } from "@/domain/port/credential/credential-repository";
import {
  type UpdateCredentialUseCase,
  updateCredentialUseCaseSchema,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  updateCredentialRepository: UpdateCredentialRepository;
};

export const makeUpdateCredentialUseCase = ({
  updateCredentialRepository,
}: Input): UpdateCredentialUseCase =>
  updateCredentialUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateCredentialRepository({
      ctx,
      id: payload.id,
      data: payload.data,
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
