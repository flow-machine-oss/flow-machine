import { BetterAuthHttpRouterFactory } from "@/api/module/auth/http-router-factory";
import { betterAuthClientFactory } from "@/di/shared";

const betterAuthHttpRouterFactory = new BetterAuthHttpRouterFactory(
  betterAuthClientFactory,
);

export { betterAuthHttpRouterFactory };
