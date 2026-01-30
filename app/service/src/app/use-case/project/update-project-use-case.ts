import { err, ok } from "neverthrow";
import type { UpdateProjectRepository } from "@/domain/port/project/project-repository";
import {
  type UpdateProjectUseCase,
  updateProjectUseCaseSchema,
} from "@/domain/port/project/project-use-case";

type Input = {
  updateProjectRepository: UpdateProjectRepository;
};

export const makeUpdateProjectUseCase = ({
  updateProjectRepository,
}: Input): UpdateProjectUseCase =>
  updateProjectUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateProjectRepository({
      ctx,
      id: payload.id,
      data: {
        name: payload.name,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
