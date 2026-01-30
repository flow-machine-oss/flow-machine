import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetProjectMongoCollection } from "@/adapter/repository/project/project-mongo-collection";
import { Err } from "@/common/err/err";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import {
  type InsertProjectRepository,
  insertProjectRepositorySchema,
} from "@/domain/port/project/project-repository";

type Input = {
  getProjectMongoCollection: GetProjectMongoCollection;
};

export const makeInsertProjectMongoRepository = ({
  getProjectMongoCollection,
}: Input): InsertProjectRepository =>
  insertProjectRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getProjectMongoCollection({ ctx });

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
