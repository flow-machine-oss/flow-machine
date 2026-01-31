import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowDefinitionMongoCollection } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteWorkflowDefinitionRepository,
  deleteWorkflowDefinitionRepositorySchema,
} from "@/domain/port/workflow/workflow-definition-repository";

type Input = {
  getWorkflowDefinitionMongoCollection: GetWorkflowDefinitionMongoCollection;
};

export const makeDeleteWorkflowDefinitionMongoRepository = ({
  getWorkflowDefinitionMongoCollection,
}: Input): DeleteWorkflowDefinitionRepository =>
  deleteWorkflowDefinitionRepositorySchema.implementAsync(
    async ({ ctx, id }) => {
      const collectionResult = await getWorkflowDefinitionMongoCollection({
        ctx,
      });

      if (collectionResult.isErr()) {
        return err(collectionResult.error);
      }
      const [error] = await attemptAsync(() =>
        collectionResult.value.deleteOne({
          _id: id,
          tenant: ctx.tenant,
        }),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
      return ok();
    },
  );
