import { err, ok } from "neverthrow";
import type { FindCredentialsRepository } from "@/domain/port/credential/credential-repository";
import {
  type ListCredentialsUseCase,
  listCredentialsUseCaseSchema,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  findCredentialsRepository: FindCredentialsRepository;
};

export const makeListCredentialsUseCase = ({
  findCredentialsRepository,
}: Input): ListCredentialsUseCase =>
  listCredentialsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findCredentialsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
