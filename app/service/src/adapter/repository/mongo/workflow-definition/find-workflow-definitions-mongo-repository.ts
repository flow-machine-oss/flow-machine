import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowDefinitionMongoCollection } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-collection";
import type { WorkflowDefinitionMongoModelToEntity } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindWorkflowDefinitionsRepository,
  findWorkflowDefinitionsRepositorySchema,
} from "@/domain/port/workflow/workflow-definition-repository";

type Input = {
  getWorkflowDefinitionMongoCollection: GetWorkflowDefinitionMongoCollection;
  workflowDefinitionMongoModelToEntity: WorkflowDefinitionMongoModelToEntity;
};

export const makeFindWorkflowDefinitionsMongoRepository = ({
  getWorkflowDefinitionMongoCollection,
  workflowDefinitionMongoModelToEntity,
}: Input): FindWorkflowDefinitionsRepository =>
  findWorkflowDefinitionsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getWorkflowDefinitionMongoCollection({
      ctx,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    return ok(docs.map((doc) => workflowDefinitionMongoModelToEntity(doc)));
  });
