import { GitRepositoryV1HttpRouterFactory } from "@/api/module/git-repository/v1/http-router-factory";
import { GitRepositoryBasicCrudService } from "@/app/domain/git-repository/basic-crud-service";
import {
  envConfigService,
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  mongoClient,
} from "@/di/shared";
import { GitRepositoryMongoCrudRepository } from "@/infra/mongo/git-repository/crud-repository";

const gitRepositoryMongoCrudRepository = new GitRepositoryMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const gitRepositoryBasicCrudService = new GitRepositoryBasicCrudService(
  gitRepositoryMongoCrudRepository,
);

const gitRepositoryV1HttpRouterFactory = new GitRepositoryV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  gitRepositoryBasicCrudService,
);

export { gitRepositoryV1HttpRouterFactory };
