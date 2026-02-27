import { AiAgentV1HttpRouterFactory } from "@/api/module/ai-agent/v1/http-router-factory";
import { AiAgentBasicCrudService } from "@/app/domain/ai-agent/basic-crud-service";
import {
  envConfigService,
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  mongoClient,
} from "@/di/shared";
import { AiAgentMongoCrudRepository } from "@/infra/mongo/ai-agent/crud-repository";

const aiAgentMongoCrudRepository = new AiAgentMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const aiAgentBasicCrudService = new AiAgentBasicCrudService(
  aiAgentMongoCrudRepository,
);

const aiAgentV1HttpRouterFactory = new AiAgentV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  aiAgentBasicCrudService,
);

export { aiAgentV1HttpRouterFactory };
