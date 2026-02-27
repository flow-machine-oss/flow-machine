import type { Inngest } from "inngest";
import type z from "zod";
import type {
  WorkflowFunctionFactory,
  workflowFunctionFactoryInputSchema,
} from "@/v2/core/domain/workflow/function/factory";

export class InngestFunctionFactory implements WorkflowFunctionFactory {
  #inngest: Inngest;

  constructor(inngest: Inngest) {
    this.#inngest = inngest;
  }

  make(input: z.infer<typeof workflowFunctionFactoryInputSchema.make>) {
    return this.#inngest.createFunction(
      input.config,
      input.trigger,
      input.handler,
    );
  }
}
