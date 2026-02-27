import type { Inngest } from "inngest";
import type z from "zod";
import type {
  DurableFunctionFactory,
  durableFunctionFactoryInputSchema,
} from "@/core/infra/durable-function/factory";

export class InngestFunctionFactory implements DurableFunctionFactory {
  #inngest: Inngest;

  constructor(inngest: Inngest) {
    this.#inngest = inngest;
  }

  make(input: z.infer<typeof durableFunctionFactoryInputSchema.make>) {
    return this.#inngest.createFunction(
      input.config,
      input.trigger,
      input.handler,
    );
  }
}
