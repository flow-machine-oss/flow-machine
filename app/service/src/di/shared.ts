import { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import { HttpErrorHandlerFactory } from "@/api/plugin/http-error-handler-factory";
import { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import { BetterAuthClientFactory } from "@/infra/better-auth/client-factory";
import { BetterAuthService } from "@/infra/better-auth/service";
import { EnvConfigService } from "@/infra/env/env-config-service";
import { mongoClient } from "@/infra/mongo/client";
import { logger } from "@/infra/pino/logger";
import { ResendEmailService } from "@/infra/resend/service";

const envConfigService = new EnvConfigService();

const resendEmailService = new ResendEmailService();

const betterAuthClientFactory = new BetterAuthClientFactory(
  envConfigService,
  resendEmailService,
  mongoClient,
);
const betterAuthService = new BetterAuthService(betterAuthClientFactory);

const httpRequestCtxFactory = new HttpRequestCtxFactory();
const httpAuthGuardFactory = new HttpAuthGuardFactory(betterAuthService);
const httpErrorHandlerFactory = new HttpErrorHandlerFactory(logger);

export {
  betterAuthClientFactory,
  httpRequestCtxFactory,
  httpAuthGuardFactory,
  httpErrorHandlerFactory,
};
