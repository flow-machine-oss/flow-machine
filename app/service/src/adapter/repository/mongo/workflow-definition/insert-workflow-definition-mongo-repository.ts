import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowDefinitionMongoCollection } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-collection";
import type { WorkflowDefinitionEntityToMongoModel } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type InsertWorkflowDefinitionRepository,
  insertWorkflowDefinitionRepositorySchema,
} from "@/domain/port/workflow-definition/workflow-definition-repository";

type Input = {
  getWorkflowDefinitionMongoCollection: GetWorkflowDefinitionMongoCollection;
  workflowDefinitionEntityToMongoModel: WorkflowDefinitionEntityToMongoModel;
};

export const makeInsertWorkflowDefinitionMongoRepository = ({
  getWorkflowDefinitionMongoCollection,
  workflowDefinitionEntityToMongoModel,
}: Input): InsertWorkflowDefinitionRepository =>
  insertWorkflowDefinitionRepositorySchema.implementAsync(
    async ({ ctx, data }) => {
      const result = await getWorkflowDefinitionMongoCollection({ ctx });

      if (result.isErr()) {
        return err(result.error);
      }
      const [error] = await attemptAsync(() =>
        result.value.insertOne(workflowDefinitionEntityToMongoModel(data)),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
      return ok();
    },
  );
