import { BetterAuthHttpRouterFactory } from "@/v2/api/module/auth/http-router-factory";
import { betterAuthClientFactory } from "@/v2/di/shared";

const betterAuthHttpRouterFactory = new BetterAuthHttpRouterFactory(
  betterAuthClientFactory,
);

export { betterAuthHttpRouterFactory };
