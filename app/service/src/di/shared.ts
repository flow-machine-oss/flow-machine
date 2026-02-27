import { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import { HttpErrorHandlerFactory } from "@/api/plugin/http-error-handler-factory";
import { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import { BetterAuthClientFactory } from "@/infra/better-auth/client-factory";
import { BetterAuthService } from "@/infra/better-auth/service";
import { EnvConfigService } from "@/infra/env/env-config-service";
import { mongoClient } from "@/infra/mongo/client";
import { logger } from "@/infra/pino/logger";
import { ResendClientFactory } from "@/infra/resend/client-factory";
import { ResendEmailService } from "@/infra/resend/service";

const envConfigService = new EnvConfigService();

const resendClientFactory = new ResendClientFactory(envConfigService);
const resendClient = resendClientFactory.make();
const resendEmailService = new ResendEmailService(resendClient);

const betterAuthClientFactory = new BetterAuthClientFactory(
  envConfigService,
  resendEmailService,
  mongoClient,
);
const betterAuthClient = betterAuthClientFactory.make();
const betterAuthService = new BetterAuthService(betterAuthClient);

const httpRequestCtxFactory = new HttpRequestCtxFactory();
const httpAuthGuardFactory = new HttpAuthGuardFactory(betterAuthService);
const httpErrorHandlerFactory = new HttpErrorHandlerFactory(logger);

export {
  betterAuthClient,
  betterAuthService,
  httpRequestCtxFactory,
  httpAuthGuardFactory,
  httpErrorHandlerFactory,
};
