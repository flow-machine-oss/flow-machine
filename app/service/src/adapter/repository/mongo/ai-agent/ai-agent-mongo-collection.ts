import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import { AiAgentMongoModel } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getAiAgentMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<AiAgentMongoModel>),
      z.instanceof(Err),
    ),
  ),
});

export type GetAiAgentMongoCollection = z.infer<
  typeof getAiAgentMongoCollectionSchema
>;

export const getAiAgentMongoCollection =
  getAiAgentMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<AiAgentMongoModel>("ai-agent");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
