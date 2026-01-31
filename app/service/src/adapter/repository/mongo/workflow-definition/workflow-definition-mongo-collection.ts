import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import type { WorkflowDefinitionMongoModel } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getWorkflowDefinitionMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<WorkflowDefinitionMongoModel>),
      z.instanceof(Err),
    ),
  ),
});
export type GetWorkflowDefinitionMongoCollection = z.infer<
  typeof getWorkflowDefinitionMongoCollectionSchema
>;

export const getWorkflowDefinitionMongoCollection =
  getWorkflowDefinitionMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<WorkflowDefinitionMongoModel>(
      "workflow-definition",
    );
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return ok(collection);
  });
