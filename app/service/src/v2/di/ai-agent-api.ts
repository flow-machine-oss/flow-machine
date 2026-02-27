import { AiAgentV1HttpRouterFactory } from "@/v2/api/module/ai-agent/v1/http-router-factory";
import { AiAgentBasicCrudService } from "@/v2/app/domain/ai-agent/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { AiAgentMongoCrudRepository } from "@/v2/infra/mongo/ai-agent/crud-repository";

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
