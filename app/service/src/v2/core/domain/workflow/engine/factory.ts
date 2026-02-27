import z from "zod";
import { WorkflowActionDefinitionEntity } from "@/v2/core/domain/workflow/definition/action/entity";
import type { WorkflowEngine } from "@/v2/core/domain/workflow/engine/type";

const workflowEngineFactoryInputSchema = {
  make: z.object({
    workflowActionDefinitions: z
      .instanceof(WorkflowActionDefinitionEntity)
      .array(),
  }),
};

interface WorkflowEngineFactory {
  make(
    input: z.infer<typeof workflowEngineFactoryInputSchema.make>,
  ): Promise<WorkflowEngine>;
}

export { type WorkflowEngineFactory, workflowEngineFactoryInputSchema };
