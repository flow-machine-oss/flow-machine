import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import { DocumentMongoModel } from "@/adapter/repository/document/document-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getDocumentMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<DocumentMongoModel>),
      z.instanceof(Err),
    ),
  ),
});

export type GetDocumentMongoCollection = z.infer<
  typeof getDocumentMongoCollectionSchema
>;

export const getDocumentMongoCollection =
  getDocumentMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<DocumentMongoModel>("document");
    return ok(collection);
  });
