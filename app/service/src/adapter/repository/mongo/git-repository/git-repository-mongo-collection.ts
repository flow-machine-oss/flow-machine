import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import type { GitRepositoryMongoModel } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getGitRepositoryMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<GitRepositoryMongoModel>),
      z.instanceof(Err),
    ),
  ),
});
export type GetGitRepositoryMongoCollection = z.infer<
  typeof getGitRepositoryMongoCollectionSchema
>;

export const getGitRepositoryMongoCollection =
  getGitRepositoryMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<GitRepositoryMongoModel>(
      "git-repository",
    );
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
