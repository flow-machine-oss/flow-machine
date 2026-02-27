import Elysia from "elysia";
import type { BetterAuthClientFactory } from "@/infra/better-auth/client-factory";

class BetterAuthHttpRouterFactory {
  #betterAuthClientFactory: BetterAuthClientFactory;

  constructor(betterAuthClientFactory: BetterAuthClientFactory) {
    this.#betterAuthClientFactory = betterAuthClientFactory;
  }

  make() {
    return new Elysia({ name: BetterAuthHttpRouterFactory.name }).mount(
      this.#betterAuthClientFactory.make().handler,
    );
  }
}

export { BetterAuthHttpRouterFactory };
