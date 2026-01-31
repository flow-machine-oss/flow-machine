import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { Err } from "@/common/err/err";
import { WorkflowEntity } from "@/domain/entity/workflow/workflow-entity";
import {
  type FindWorkflowsRepository,
  findWorkflowsRepositorySchema,
} from "@/domain/port/workflow/workflow-repository";

type Input = {
  getWorkflowMongoCollection: GetWorkflowMongoCollection;
};

export const makeFindWorkflowsMongoRepository = ({
  getWorkflowMongoCollection,
}: Input): FindWorkflowsRepository =>
  findWorkflowsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getWorkflowMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    const entities: WorkflowEntity[] = [];

    for (const doc of docs) {
      const entityResult = WorkflowEntity.makeExisting(
        doc._id,
        doc.createdAt,
        doc.updatedAt,
        doc.tenant,
        {
          name: doc.name,
          description: doc.description,
          projectId: doc.projectId,
          actions: doc.actions,
          edges: doc.edges,
          isActive: doc.isActive,
        },
      );

      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      entities.push(entityResult.value);
    }
    return ok(entities);
  });
