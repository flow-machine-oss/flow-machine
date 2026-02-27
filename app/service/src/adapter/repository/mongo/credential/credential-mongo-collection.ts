import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import { CredentialMongoModel } from "@/adapter/repository/mongo/credential/credential-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getCredentialMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<CredentialMongoModel>),
      z.instanceof(Err),
    ),
  ),
});

export type GetCredentialMongoCollection = z.infer<
  typeof getCredentialMongoCollectionSchema
>;

export const getCredentialMongoCollection =
  getCredentialMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection =
      ctx.mongoDb.collection<CredentialMongoModel>("credential");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
