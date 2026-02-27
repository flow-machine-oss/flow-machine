import { GitRepositoryV1HttpRouterFactory } from "@/v2/api/module/git-repository/v1/http-router-factory";
import { GitRepositoryBasicCrudService } from "@/v2/app/domain/git-repository/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { GitRepositoryMongoCrudRepository } from "@/v2/infra/mongo/git-repository/crud-repository";

const gitRepositoryMongoCrudRepository = new GitRepositoryMongoCrudRepository();
const gitRepositoryBasicCrudService = new GitRepositoryBasicCrudService(
  gitRepositoryMongoCrudRepository,
);

const gitRepositoryV1HttpRouterFactory = new GitRepositoryV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  gitRepositoryBasicCrudService,
);

export { gitRepositoryV1HttpRouterFactory };
