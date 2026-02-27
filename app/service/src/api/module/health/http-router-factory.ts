import Elysia from "elysia";
import type { ConfigService } from "@/core/infra/config/service";

class HealthHttpRouterFactory {
  #configService: ConfigService;

  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  make() {
    return new Elysia().get("/health", () => ({
      status: "ok",
      version: this.#configService.get("app.version"),
      environment: this.#configService.get("app.env"),
    }));
  }
}

export { HealthHttpRouterFactory };
