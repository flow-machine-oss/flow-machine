import { err, ok } from "neverthrow";
import type { DeleteWorkflowRepository } from "@/domain/port/workflow/workflow-repository";
import {
  type DeleteWorkflowUseCase,
  deleteWorkflowUseCaseSchema,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  deleteWorkflowRepository: DeleteWorkflowRepository;
};

export const makeDeleteWorkflowUseCase = ({
  deleteWorkflowRepository,
}: Input): DeleteWorkflowUseCase =>
  deleteWorkflowUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteWorkflowRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
