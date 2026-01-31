import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";

const workflowActionDefinitionCtxSchema = z.object({
  ...mongoCtxSchema.shape,
});

export const listWorkflowActionDefinitionsUseCaseInputSchema = z.object({
  ctx: workflowActionDefinitionCtxSchema,
});
