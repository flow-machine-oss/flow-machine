import type { Handler, InngestFunction } from "inngest";
import z from "zod";

const workflowFunctionFactoryInputSchema = {
  make: z.object({
    config: z.object({
      id: z.string(),
    }),
    trigger: z.object({
      event: z.string(),
    }),
    handler: z.custom<Handler.Any>(),
  }),
};

interface WorkflowFunctionFactory {
  make(
    input: z.infer<typeof workflowFunctionFactoryInputSchema.make>,
  ): InngestFunction.Any;
}

export { type WorkflowFunctionFactory, workflowFunctionFactoryInputSchema };
