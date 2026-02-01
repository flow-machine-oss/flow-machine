import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateGitRepositoryRepository,
  updateGitRepositoryRepositorySchema,
} from "@/domain/port/git-repository/git-repository-repository";

type Input = {
  getGitRepositoryMongoCollection: GetGitRepositoryMongoCollection;
};

export const makeUpdateGitRepositoryMongoRepository = ({
  getGitRepositoryMongoCollection,
}: Input): UpdateGitRepositoryRepository =>
  updateGitRepositoryRepositorySchema.implementAsync(
    async ({ ctx, id, data }) => {
      const collectionResult = await getGitRepositoryMongoCollection({
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
