import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindCredentialByIdRepository } from "@/domain/port/credential/credential-repository";
import {
  type GetCredentialUseCase,
  getCredentialUseCaseSchema,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  findCredentialByIdRepository: FindCredentialByIdRepository;
};

export const makeGetCredentialUseCase = ({
  findCredentialByIdRepository,
}: Input): GetCredentialUseCase =>
  getCredentialUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findCredentialByIdRepository({
      ctx,
      id: payload.id,
    });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    if (findResult.value === null) {
      return err(Err.code("notFound"));
    }
    return ok(findResult.value);
  });
