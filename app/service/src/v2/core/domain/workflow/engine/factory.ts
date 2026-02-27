import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { WorkflowActionDefinitionEntity } from "@/v2/core/domain/workflow/action/definition/entity";
import { WorkflowDefinitionEntity } from "@/v2/core/domain/workflow/definition/entity";
import type { WorkflowEngine } from "@/v2/core/domain/workflow/engine/type";

const workflowEngineFactoryInputSchema = {
  make: z.object({
    ctx: z.object({
      ...tenantCtxSchema.shape,
      ...mongoCtxSchema.shape,
    }),
    workflowActionDefinitions: z
      .instanceof(WorkflowActionDefinitionEntity)
      .array(),
    workflowDefinition: z.instanceof(WorkflowDefinitionEntity),
  }),
};

interface WorkflowEngineFactory {
  make(
    input: z.infer<typeof workflowEngineFactoryInputSchema.make>,
  ): Promise<WorkflowEngine>;
}

export { type WorkflowEngineFactory, workflowEngineFactoryInputSchema };
