import { err, ok } from "neverthrow";
import type { DeleteWorkflowDefinitionRepository } from "@/domain/port/workflow/workflow-definition-repository";
import {
  type DeleteWorkflowDefinitionUseCase,
  deleteWorkflowDefinitionUseCaseSchema,
} from "@/domain/port/workflow/workflow-definition-use-case";

type Input = {
  deleteWorkflowDefinitionRepository: DeleteWorkflowDefinitionRepository;
};

export const makeDeleteWorkflowDefinitionUseCase = ({
  deleteWorkflowDefinitionRepository,
}: Input): DeleteWorkflowDefinitionUseCase =>
  deleteWorkflowDefinitionUseCaseSchema.implementAsync(
    async ({ ctx, payload }) => {
      const deleteResult = await deleteWorkflowDefinitionRepository({
        ctx,
        id: payload.id,
      });

      if (deleteResult.isErr()) {
        return err(deleteResult.error);
      }
      return ok();
    },
  );
