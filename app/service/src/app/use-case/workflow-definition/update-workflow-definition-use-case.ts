import { err, ok } from "neverthrow";
import type { UpdateWorkflowDefinitionRepository } from "@/domain/port/workflow-definition/workflow-definition-repository";
import {
  type UpdateWorkflowDefinitionUseCase,
  updateWorkflowDefinitionUseCaseSchema,
} from "@/domain/port/workflow-definition/workflow-definition-use-case";

type Input = {
  updateWorkflowDefinitionRepository: UpdateWorkflowDefinitionRepository;
};

export const makeUpdateWorkflowDefinitionUseCase = ({
  updateWorkflowDefinitionRepository,
}: Input): UpdateWorkflowDefinitionUseCase =>
  updateWorkflowDefinitionUseCaseSchema.implementAsync(
    async ({ ctx, payload }) => {
      const updateResult = await updateWorkflowDefinitionRepository({
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
    },
  );
