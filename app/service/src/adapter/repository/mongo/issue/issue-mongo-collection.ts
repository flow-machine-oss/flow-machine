import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import type { IssueMongoModel } from "@/adapter/repository/mongo/issue/issue-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getIssueMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<IssueMongoModel>),
      z.instanceof(Err),
    ),
  ),
});
export type GetIssueMongoCollection = z.infer<
  typeof getIssueMongoCollectionSchema
>;

export const getIssueMongoCollection =
  getIssueMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<IssueMongoModel>("issue");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
