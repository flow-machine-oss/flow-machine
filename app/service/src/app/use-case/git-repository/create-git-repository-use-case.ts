import { err, ok } from "neverthrow";
import { GitRepositoryEntity } from "@/domain/entity/git-repository/git-repository-entity";
import type { InsertGitRepositoryRepository } from "@/domain/port/git-repository/git-repository-repository";
import {
  type CreateGitRepositoryUseCase,
  createGitRepositoryUseCaseSchema,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  insertGitRepositoryRepository: InsertGitRepositoryRepository;
};

export const makeCreateGitRepositoryUseCase = ({
  insertGitRepositoryRepository,
}: Input): CreateGitRepositoryUseCase =>
  createGitRepositoryUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const newEntity = GitRepositoryEntity.makeNew(ctx.tenant, {
      name: payload.name,
      url: payload.url,
      config: payload.config,
      integration: payload.integration,
    });
    const insertResult = await insertGitRepositoryRepository({
      ctx,
      data: newEntity,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
