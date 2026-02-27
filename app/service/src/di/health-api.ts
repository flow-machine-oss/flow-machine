import { HealthHttpRouterFactory } from "@/api/module/health/http-router-factory";
import { envConfigService } from "@/di/shared";

const healthHttpRouterFactory = new HealthHttpRouterFactory(envConfigService);

export { healthHttpRouterFactory };
