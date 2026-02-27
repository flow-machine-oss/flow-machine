import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindGitRepositoryByIdRepository } from "@/domain/port/git-repository/git-repository-repository";
import {
  type GetGitRepositoryUseCase,
  getGitRepositoryUseCaseSchema,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  findGitRepositoryByIdRepository: FindGitRepositoryByIdRepository;
};

export const makeGetGitRepositoryUseCase = ({
  findGitRepositoryByIdRepository,
}: Input): GetGitRepositoryUseCase =>
  getGitRepositoryUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findGitRepositoryByIdRepository({
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
