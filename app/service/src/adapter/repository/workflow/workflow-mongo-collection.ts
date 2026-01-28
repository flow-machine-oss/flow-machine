import { Collection } from "mongodb";
import { ok } from "neverthrow";
import z from "zod";
import { WorkflowMongoModel } from "@/adapter/repository/workflow/workflow-mongo-model";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

export const getWorkflowMongoCollectionSchema = z.function({
  input: [
    z.object({
      ctx: z.object({
        ...mongoCtxSchema.shape,
      }),
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(Collection<WorkflowMongoModel>),
      z.instanceof(Err),
    ),
  ),
});

export type GetWorkflowMongoCollection = z.infer<
  typeof getWorkflowMongoCollectionSchema
>;

export const getWorkflowMongoCollection =
  getWorkflowMongoCollectionSchema.implementAsync(async ({ ctx }) => {
    const collection = ctx.mongoDb.collection<WorkflowMongoModel>("workflow");
    return ok(collection);
  });
