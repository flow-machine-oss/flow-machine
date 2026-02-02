import { err, ok } from "neverthrow";
import { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import type { InsertCredentialRepository } from "@/domain/port/credential/credential-repository";
import {
  type CreateCredentialUseCase,
  createCredentialUseCaseSchema,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  insertCredentialRepository: InsertCredentialRepository;
};

export const makeCreateCredentialUseCase = ({
  insertCredentialRepository,
}: Input): CreateCredentialUseCase =>
  createCredentialUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const makeNewEntityResult = CredentialEntity.makeNew(ctx.tenant, payload);

    if (makeNewEntityResult.isErr()) {
      return err(makeNewEntityResult.error);
    }
    const insertResult = await insertCredentialRepository({
      ctx,
      data: makeNewEntityResult.value,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
