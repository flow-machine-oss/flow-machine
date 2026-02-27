import { ProjectV1HttpRouterFactory } from "@/api/module/project/v1/http-router-factory";
import { ProjectBasicCrudService } from "@/app/domain/project/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/di/shared";
import { ProjectMongoCrudRepository } from "@/infra/mongo/project/crud-repository";

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
