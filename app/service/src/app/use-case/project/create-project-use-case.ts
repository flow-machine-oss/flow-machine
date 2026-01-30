import { err, ok } from "neverthrow";
import { ProjectEntity } from "@/domain/entity/project/project-entity";
import type { InsertProjectRepository } from "@/domain/port/project/project-repository";
import {
  type CreateProjectUseCase,
  createProjectUseCaseSchema,
} from "@/domain/port/project/project-use-case";

type Input = {
  insertProjectRepository: InsertProjectRepository;
};

export const makeCreateProjectUseCase = ({
  insertProjectRepository,
}: Input): CreateProjectUseCase =>
  createProjectUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const makeNewEntityResult = ProjectEntity.makeNew(ctx.tenant, {
      name: payload.name,
    });

    if (makeNewEntityResult.isErr()) {
      return err(makeNewEntityResult.error);
    }
    const insertResult = await insertProjectRepository({
      ctx,
      data: makeNewEntityResult.value,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
