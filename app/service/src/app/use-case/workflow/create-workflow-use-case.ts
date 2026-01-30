import { err, ok } from "neverthrow";
import { WorkflowEntity } from "@/domain/entity/workflow/workflow-entity";
import type { InsertWorkflowRepository } from "@/domain/port/workflow/workflow-repository";
import {
  type CreateWorkflowUseCase,
  createWorkflowUseCaseSchema,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  insertWorkflowRepository: InsertWorkflowRepository;
};

export const makeCreateWorkflowUseCase = ({
  insertWorkflowRepository,
}: Input): CreateWorkflowUseCase =>
  createWorkflowUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const makeNewEntityResult = WorkflowEntity.makeNew(ctx.tenant, {
      name: payload.name,
      description: payload.description,
      projectId: payload.projectId,
      actions: payload.actions,
      edges: payload.edges,
      isActive: payload.isActive,
    });

    if (makeNewEntityResult.isErr()) {
      return err(makeNewEntityResult.error);
    }
    const insertResult = await insertWorkflowRepository({
      ctx,
      data: makeNewEntityResult.value,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
