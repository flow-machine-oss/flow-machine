import { err, ok } from "neverthrow";
import type { UpdateWorkflowRepository } from "@/domain/port/workflow/workflow-repository";
import {
  type UpdateWorkflowUseCase,
  updateWorkflowUseCaseSchema,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  updateWorkflowRepository: UpdateWorkflowRepository;
};

export const makeUpdateWorkflowUseCase = ({
  updateWorkflowRepository,
}: Input): UpdateWorkflowUseCase =>
  updateWorkflowUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateWorkflowRepository({
      ctx,
      id: payload.id,
      data: {
        name: payload.name,
        description: payload.description,
        projectId: payload.projectId,
        actions: payload.actions,
        edges: payload.edges,
        isActive: payload.isActive,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
