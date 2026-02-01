import { err, ok } from "neverthrow";
import type { FindGitRepositoriesRepository } from "@/domain/port/git-repository/git-repository-repository";
import {
  type ListGitRepositoriesUseCase,
  listGitRepositoriesUseCaseSchema,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  findGitRepositoriesRepository: FindGitRepositoriesRepository;
};

export const makeListGitRepositoriesUseCase = ({
  findGitRepositoriesRepository,
}: Input): ListGitRepositoriesUseCase =>
  listGitRepositoriesUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findGitRepositoriesRepository({ ctx });
    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
