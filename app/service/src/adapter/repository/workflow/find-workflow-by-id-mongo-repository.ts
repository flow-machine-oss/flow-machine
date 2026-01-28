import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { Err } from "@/common/err/err";
import { WorkflowEntity } from "@/domain/entity/workflow/workflow-entity";
import {
  type FindWorkflowByIdRepository,
  findWorkflowByIdRepositorySchema,
} from "@/domain/port/workflow/workflow-repository";

type Input = {
  getWorkflowMongoCollection: GetWorkflowMongoCollection;
};

export const makeFindWorkflowByIdMongoRepository = ({
  getWorkflowMongoCollection,
}: Input): FindWorkflowByIdRepository =>
  findWorkflowByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getWorkflowMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, doc] = await attemptAsync(() =>
      collectionResult.value.findOne({
        _id: id,
        tenantId: ctx.tenantId,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    if (doc === null) {
      return ok(null);
    }
    const entityResult = WorkflowEntity.makeExisting(
      doc._id,
      doc.createdAt,
      doc.updatedAt,
      doc.tenantId,
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
    return ok(entityResult.value);
  });
