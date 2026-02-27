import { ProjectV1HttpRouterFactory } from "@/v2/api/module/project/v1/http-router-factory";
import { ProjectBasicCrudService } from "@/v2/app/domain/project/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { ProjectMongoCrudRepository } from "@/v2/infra/mongo/project/crud-repository";

const projectMongoCrudRepository = new ProjectMongoCrudRepository();
const projectBasicCrudService = new ProjectBasicCrudService(
  projectMongoCrudRepository,
);

const projectV1HttpRouterFactory = new ProjectV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  projectBasicCrudService,
);

export { projectV1HttpRouterFactory };
