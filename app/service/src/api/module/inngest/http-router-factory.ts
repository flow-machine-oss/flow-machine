import Elysia from "elysia";
import type { Inngest, InngestFunction } from "inngest";
import { serve } from "inngest/bun";

class InngestHttpRouterFactory {
  #inngest: Inngest;
  #functions: InngestFunction.Any[];

  constructor(inngest: Inngest, functions: InngestFunction.Any[]) {
    this.#inngest = inngest;
    this.#functions = functions;
  }

  make() {
    return new Elysia({ name: InngestHttpRouterFactory.name }).all(
      "/api/inngest",
      ({ request }) =>
        serve({
          client: this.#inngest,
          functions: this.#functions,
        })(request),
    );
  }
}

export { InngestHttpRouterFactory };
