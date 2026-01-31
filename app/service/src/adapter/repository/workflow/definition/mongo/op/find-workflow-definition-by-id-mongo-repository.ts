import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowDefinitionMongoCollection } from "@/adapter/repository/workflow/definition/mongo/workflow-definition-mongo-collection";
import type { WorkflowDefinitionMongoModelToEntity } from "@/adapter/repository/workflow/definition/mongo/workflow-definition-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindWorkflowDefinitionByIdRepository,
  findWorkflowDefinitionByIdRepositorySchema,
} from "@/domain/port/workflow/workflow-definition-repository";

type Input = {
  getWorkflowDefinitionMongoCollection: GetWorkflowDefinitionMongoCollection;
  workflowDefinitionMongoModelToEntity: WorkflowDefinitionMongoModelToEntity;
};

export const makeFindWorkflowDefinitionByIdMongoRepository = ({
  getWorkflowDefinitionMongoCollection,
  workflowDefinitionMongoModelToEntity,
}: Input): FindWorkflowDefinitionByIdRepository =>
  findWorkflowDefinitionByIdRepositorySchema.implementAsync(
    async ({ ctx, id }) => {
      const collectionResult = await getWorkflowDefinitionMongoCollection({
        ctx,
      });

      if (collectionResult.isErr()) {
        return err(collectionResult.error);
      }
      const [error, doc] = await attemptAsync(() =>
        collectionResult.value.findOne({
          _id: id,
          tenant: ctx.tenant,
        }),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
      if (doc === null) {
        return ok(null);
      }
      return ok(workflowDefinitionMongoModelToEntity(doc));
    },
  );
