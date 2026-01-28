import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { Err } from "@/common/err/err";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import {
  type InsertWorkflowRepository,
  insertWorkflowRepositorySchema,
} from "@/domain/port/workflow/workflow-repository";

type Input = {
  getWorkflowMongoCollection: GetWorkflowMongoCollection;
};

export const makeInsertWorkflowMongoRepository = ({
  getWorkflowMongoCollection,
}: Input): InsertWorkflowRepository =>
  insertWorkflowRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getWorkflowMongoCollection({ ctx });

    if (result.isErr()) {
      return err(result.error);
    }
    const [error] = await attemptAsync(() =>
      result.value.insertOne(tenantAwareEntityToMongoModel(data)),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
