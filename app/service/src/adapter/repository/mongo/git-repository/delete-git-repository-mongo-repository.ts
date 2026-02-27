import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteGitRepositoryRepository,
  deleteGitRepositoryRepositorySchema,
} from "@/domain/port/git-repository/git-repository-repository";

type Input = {
  getGitRepositoryMongoCollection: GetGitRepositoryMongoCollection;
};

export const makeDeleteGitRepositoryMongoRepository = ({
  getGitRepositoryMongoCollection,
}: Input): DeleteGitRepositoryRepository =>
  deleteGitRepositoryRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getGitRepositoryMongoCollection({
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
  });
