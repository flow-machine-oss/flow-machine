import Elysia from "elysia";
import { config } from "@/common/config/config";

class HealthHttpRouterFactory {
  make() {
    return new Elysia().get("/health", () => ({
      status: "ok",
      version: config.app.version,
      environment: config.app.env,
    }));
  }
}

export { HealthHttpRouterFactory };
