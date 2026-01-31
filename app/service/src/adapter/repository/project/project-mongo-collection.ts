import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import { ProjectMongoModel } from "@/adapter/repository/project/project-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getProjectMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<ProjectMongoModel>),
      z.instanceof(Err),
    ),
  ),
});

export type GetProjectMongoCollection = z.infer<
  typeof getProjectMongoCollectionSchema
>;

export const getProjectMongoCollection =
  getProjectMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<ProjectMongoModel>("project");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
