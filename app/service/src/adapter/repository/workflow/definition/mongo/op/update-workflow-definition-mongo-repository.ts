import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowDefinitionMongoCollection } from "@/adapter/repository/workflow/definition/mongo/workflow-definition-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateWorkflowDefinitionRepository,
  updateWorkflowDefinitionRepositorySchema,
} from "@/domain/port/workflow/workflow-definition-repository";

type Input = {
  getWorkflowDefinitionMongoCollection: GetWorkflowDefinitionMongoCollection;
};

export const makeUpdateWorkflowDefinitionMongoRepository = ({
  getWorkflowDefinitionMongoCollection,
}: Input): UpdateWorkflowDefinitionRepository =>
  updateWorkflowDefinitionRepositorySchema.implementAsync(
    async ({ ctx, id, data }) => {
      const collectionResult = await getWorkflowDefinitionMongoCollection({
        ctx,
      });

      if (collectionResult.isErr()) {
        return err(collectionResult.error);
      }
      const [error] = await attemptAsync(() =>
        collectionResult.value.updateOne(
          { _id: id, tenant: ctx.tenant },
          { $set: { ...omitBy(data, isUndefined), updatedAt: new UTCDate() } },
        ),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
      return ok();
    },
  );
