import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetProjectMongoCollection } from "@/adapter/repository/project/project-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteProjectRepository,
  deleteProjectRepositorySchema,
} from "@/domain/port/project/project-repository";

type Input = {
  getProjectMongoCollection: GetProjectMongoCollection;
};

export const makeDeleteProjectMongoRepository = ({
  getProjectMongoCollection,
}: Input): DeleteProjectRepository =>
  deleteProjectRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getProjectMongoCollection({ ctx });

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
  });
