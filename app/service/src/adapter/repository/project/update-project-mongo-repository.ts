import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetProjectMongoCollection } from "@/adapter/repository/project/project-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateProjectRepository,
  updateProjectRepositorySchema,
} from "@/domain/port/project/project-repository";

type Input = {
  getProjectMongoCollection: GetProjectMongoCollection;
};

export const makeUpdateProjectMongoRepository = ({
  getProjectMongoCollection,
}: Input): UpdateProjectRepository =>
  updateProjectRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getProjectMongoCollection({ ctx });

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
  });
