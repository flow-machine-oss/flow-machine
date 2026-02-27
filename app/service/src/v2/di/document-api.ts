import { DocumentV1HttpRouterFactory } from "@/v2/api/module/document/v1/http-router-factory";
import { DocumentBasicCrudService } from "@/v2/app/domain/document/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { DocumentMongoCrudRepository } from "@/v2/infra/mongo/document/crud-repository";

const documentMongoCrudRepository = new DocumentMongoCrudRepository();
const documentBasicCrudService = new DocumentBasicCrudService(
  documentMongoCrudRepository,
);

const documentV1HttpRouterFactory = new DocumentV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  documentBasicCrudService,
);

export { documentV1HttpRouterFactory };
