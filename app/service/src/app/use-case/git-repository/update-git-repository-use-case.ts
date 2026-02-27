import { err, ok } from "neverthrow";
import type { UpdateGitRepositoryRepository } from "@/domain/port/git-repository/git-repository-repository";
import {
  type UpdateGitRepositoryUseCase,
  updateGitRepositoryUseCaseSchema,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  updateGitRepositoryRepository: UpdateGitRepositoryRepository;
};

export const makeUpdateGitRepositoryUseCase = ({
  updateGitRepositoryRepository,
}: Input): UpdateGitRepositoryUseCase =>
  updateGitRepositoryUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateGitRepositoryRepository({
      ctx,
      id: payload.id,
      data: {
        name: payload.name,
        url: payload.url,
        config: payload.config,
        integration: payload.integration,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
