import { err, ok } from "neverthrow";
import type { DeleteProjectRepository } from "@/domain/port/project/project-repository";
import {
  type DeleteProjectUseCase,
  deleteProjectUseCaseSchema,
} from "@/domain/port/project/project-use-case";

type Input = {
  deleteProjectRepository: DeleteProjectRepository;
};

export const makeDeleteProjectUseCase = ({
  deleteProjectRepository,
}: Input): DeleteProjectUseCase =>
  deleteProjectUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteProjectRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
