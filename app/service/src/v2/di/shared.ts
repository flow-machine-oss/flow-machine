import { HttpAuthGuardFactory } from "@/v2/api/plugin/http-auth-guard-factory";
import { HttpRequestCtxFactory } from "@/v2/api/plugin/http-request-ctx-factory";
import { BetterAuthClientFactory } from "@/v2/infra/better-auth/client-factory";
import { BetterAuthService } from "@/v2/infra/better-auth/service";
import { ResendEmailService } from "@/v2/infra/resend/service";

const resendEmailService = new ResendEmailService();

const betterAuthClientFactory = new BetterAuthClientFactory(resendEmailService);
const betterAuthService = new BetterAuthService(betterAuthClientFactory);

const httpRequestCtxFactory = new HttpRequestCtxFactory();
const httpAuthGuardFactory = new HttpAuthGuardFactory(betterAuthService);

export { httpRequestCtxFactory, httpAuthGuardFactory };
