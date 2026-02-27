import { BetterAuthHttpRouterFactory } from "@/api/module/auth/http-router-factory";
import { betterAuthClient } from "@/di/shared";

const betterAuthHttpRouterFactory = new BetterAuthHttpRouterFactory(
  betterAuthClient,
);

export { betterAuthHttpRouterFactory };
