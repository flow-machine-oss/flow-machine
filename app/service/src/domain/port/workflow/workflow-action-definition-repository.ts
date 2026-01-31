import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { WorkflowActionDefinitionEntity } from "@/domain/entity/workflow/workflow-action-definition-entity";

const workflowActionDefinitionRepositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
});

export const findWorkflowActionDefinitionsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowActionDefinitionRepositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(WorkflowActionDefinitionEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type FindWorkflowActionDefinitionsRepository = z.output<
  typeof findWorkflowActionDefinitionsRepositorySchema
>;
