import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import type { GitRepositoryMongoModelToEntity } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindGitRepositoryByIdRepository,
  findGitRepositoryByIdRepositorySchema,
} from "@/domain/port/git-repository/git-repository-repository";

type Input = {
  getGitRepositoryMongoCollection: GetGitRepositoryMongoCollection;
  gitRepositoryMongoModelToEntity: GitRepositoryMongoModelToEntity;
};

export const makeFindGitRepositoryByIdMongoRepository = ({
  getGitRepositoryMongoCollection,
  gitRepositoryMongoModelToEntity,
}: Input): FindGitRepositoryByIdRepository =>
  findGitRepositoryByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getGitRepositoryMongoCollection({
      ctx,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, doc] = await attemptAsync(() =>
      collectionResult.value.findOne({
        _id: id,
        tenant: ctx.tenant,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    if (doc === null) {
      return ok(null);
    }
    return ok(gitRepositoryMongoModelToEntity(doc));
  });
