import { AiAgentV1HttpRouterFactory } from "@/v2/api/module/ai-agent/v1/http-router-factory";
import { HttpAuthGuardFactory } from "@/v2/api/plugin/http-auth-guard-factory";
import { HttpRequestCtxFactory } from "@/v2/api/plugin/http-request-ctx-factory";
import { AiAgentBasicCrudService } from "@/v2/app/domain/ai-agent/basic-crud-service";
import { BetterAuthClientFactory } from "@/v2/infra/better-auth/client-factory";
import { BetterAuthService } from "@/v2/infra/better-auth/service";
import { AiAgentMongoCrudRepository } from "@/v2/infra/mongo/ai-agent/crud-repository";
import { ResendEmailService } from "@/v2/infra/resend/service";

const resendEmailService = new ResendEmailService();

const betterAuthClientFactory = new BetterAuthClientFactory(resendEmailService);
const betterAuthService = new BetterAuthService(betterAuthClientFactory);

const httpRequestCtxFactory = new HttpRequestCtxFactory();
const httpAuthGuardFactory = new HttpAuthGuardFactory(betterAuthService);

const aiAgentMongoCrudRepository = new AiAgentMongoCrudRepository();
const aiAgentBasicCrudService = new AiAgentBasicCrudService(
  aiAgentMongoCrudRepository,
);

const aiAgentV1HttpRouterFactory = new AiAgentV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  aiAgentBasicCrudService,
);

export { aiAgentV1HttpRouterFactory };
