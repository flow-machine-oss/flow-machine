import { err, ok } from "neverthrow";
import { WorkflowDefinitionEntity } from "@/domain/entity/workflow/workflow-definition-entity";
import type { InsertWorkflowDefinitionRepository } from "@/domain/port/workflow/workflow-definition-repository";
import {
  type CreateWorkflowDefinitionUseCase,
  createWorkflowDefinitionUseCaseSchema,
} from "@/domain/port/workflow/workflow-definition-use-case";

type Input = {
  insertWorkflowDefinitionRepository: InsertWorkflowDefinitionRepository;
};

export const makeCreateWorkflowDefinitionUseCase = ({
  insertWorkflowDefinitionRepository,
}: Input): CreateWorkflowDefinitionUseCase =>
  createWorkflowDefinitionUseCaseSchema.implementAsync(
    async ({ ctx, payload }) => {
      const newEntity = WorkflowDefinitionEntity.makeNew(ctx.tenant, {
        name: payload.name,
        description: payload.description,
        projectId: payload.projectId,
        actions: payload.actions,
        edges: payload.edges,
        isActive: payload.isActive,
      });
      const insertResult = await insertWorkflowDefinitionRepository({
        ctx,
        data: newEntity,
      });

      if (insertResult.isErr()) {
        return err(insertResult.error);
      }
      return ok();
    },
  );
