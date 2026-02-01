import { err, ok } from "neverthrow";
import type { DeleteGitRepositoryRepository } from "@/domain/port/git-repository/git-repository-repository";
import {
  type DeleteGitRepositoryUseCase,
  deleteGitRepositoryUseCaseSchema,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  deleteGitRepositoryRepository: DeleteGitRepositoryRepository;
};

export const makeDeleteGitRepositoryUseCase = ({
  deleteGitRepositoryRepository,
}: Input): DeleteGitRepositoryUseCase =>
  deleteGitRepositoryUseCaseSchema.implementAsync(
    async ({ ctx, payload }) => {
      const deleteResult = await deleteGitRepositoryRepository({
        ctx,
        id: payload.id,
      });

      if (deleteResult.isErr()) {
        return err(deleteResult.error);
      }
      return ok();
    },
  );
