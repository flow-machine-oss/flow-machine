import { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import { BetterAuthClientFactory } from "@/infra/better-auth/client-factory";
import { BetterAuthService } from "@/infra/better-auth/service";
import { ResendEmailService } from "@/infra/resend/service";

const resendEmailService = new ResendEmailService();

const betterAuthClientFactory = new BetterAuthClientFactory(resendEmailService);
const betterAuthService = new BetterAuthService(betterAuthClientFactory);

const httpRequestCtxFactory = new HttpRequestCtxFactory();
const httpAuthGuardFactory = new HttpAuthGuardFactory(betterAuthService);

export { betterAuthClientFactory, httpRequestCtxFactory, httpAuthGuardFactory };
