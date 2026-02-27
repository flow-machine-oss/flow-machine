import { DocumentV1HttpRouterFactory } from "@/api/module/document/v1/http-router-factory";
import { DocumentBasicCrudService } from "@/app/domain/document/basic-crud-service";
import {
  envConfigService,
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  mongoClient,
} from "@/di/shared";
import { DocumentMongoCrudRepository } from "@/infra/mongo/document/crud-repository";

const documentMongoCrudRepository = new DocumentMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const documentBasicCrudService = new DocumentBasicCrudService(
  documentMongoCrudRepository,
);

const documentV1HttpRouterFactory = new DocumentV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  documentBasicCrudService,
);

export { documentV1HttpRouterFactory };
