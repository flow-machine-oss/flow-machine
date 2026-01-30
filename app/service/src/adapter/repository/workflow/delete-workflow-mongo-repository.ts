import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteWorkflowRepository,
  deleteWorkflowRepositorySchema,
} from "@/domain/port/workflow/workflow-repository";

type Input = {
  getWorkflowMongoCollection: GetWorkflowMongoCollection;
};

export const makeDeleteWorkflowMongoRepository = ({
  getWorkflowMongoCollection,
}: Input): DeleteWorkflowRepository =>
  deleteWorkflowRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getWorkflowMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error] = await attemptAsync(() =>
      collectionResult.value.deleteOne({
        _id: id,
        "tenant.id": ctx.tenant.id,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
