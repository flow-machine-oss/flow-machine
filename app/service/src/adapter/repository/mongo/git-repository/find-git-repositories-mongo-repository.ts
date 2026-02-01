import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import type { GitRepositoryMongoModelToEntity } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindGitRepositoriesRepository,
  findGitRepositoriesRepositorySchema,
} from "@/domain/port/git-repository/git-repository-repository";

type Input = {
  getGitRepositoryMongoCollection: GetGitRepositoryMongoCollection;
  gitRepositoryMongoModelToEntity: GitRepositoryMongoModelToEntity;
};

export const makeFindGitRepositoriesMongoRepository = ({
  getGitRepositoryMongoCollection,
  gitRepositoryMongoModelToEntity,
}: Input): FindGitRepositoriesRepository =>
  findGitRepositoriesRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getGitRepositoryMongoCollection({
      ctx,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    return ok(docs.map((doc) => gitRepositoryMongoModelToEntity(doc)));
  });
