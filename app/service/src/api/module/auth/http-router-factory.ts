import type { Auth } from "better-auth/types";
import Elysia from "elysia";

class BetterAuthHttpRouterFactory {
  #betterAuthClient: Auth;

  constructor(betterAuthClient: Auth) {
    this.#betterAuthClient = betterAuthClient;
  }

  make() {
    return new Elysia({ name: BetterAuthHttpRouterFactory.name }).mount(
      this.#betterAuthClient.handler,
    );
  }
}

export { BetterAuthHttpRouterFactory };
