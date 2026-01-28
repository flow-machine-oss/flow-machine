import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateWorkflowRepository,
  updateWorkflowRepositorySchema,
} from "@/domain/port/workflow/workflow-repository";

type Input = {
  getWorkflowMongoCollection: GetWorkflowMongoCollection;
};

export const makeUpdateWorkflowMongoRepository = ({
  getWorkflowMongoCollection,
}: Input): UpdateWorkflowRepository =>
  updateWorkflowRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getWorkflowMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error] = await attemptAsync(() =>
      collectionResult.value.updateOne(
        { _id: id, tenantId: ctx.tenantId },
        { $set: { ...omitBy(data, isUndefined), updatedAt: new UTCDate() } },
      ),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
