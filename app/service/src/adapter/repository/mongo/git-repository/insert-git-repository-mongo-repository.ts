import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import type { GitRepositoryEntityToMongoModel } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type InsertGitRepositoryRepository,
  insertGitRepositoryRepositorySchema,
} from "@/domain/port/git-repository/git-repository-repository";

type Input = {
  getGitRepositoryMongoCollection: GetGitRepositoryMongoCollection;
  gitRepositoryEntityToMongoModel: GitRepositoryEntityToMongoModel;
};

export const makeInsertGitRepositoryMongoRepository = ({
  getGitRepositoryMongoCollection,
  gitRepositoryEntityToMongoModel,
}: Input): InsertGitRepositoryRepository =>
  insertGitRepositoryRepositorySchema.implementAsync(
    async ({ ctx, data }) => {
      const result = await getGitRepositoryMongoCollection({ ctx });

      if (result.isErr()) {
        return err(result.error);
      }
      const [error] = await attemptAsync(() =>
        result.value.insertOne(gitRepositoryEntityToMongoModel(data)),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
      return ok();
    },
  );
