import { gitRepositoryEntityToResponseDto } from "@/adapter/http/git-repository/git-repository-http-v1-dto-mapper";
import { makeGitRepositoryHttpV1Router } from "@/adapter/http/git-repository/git-repository-http-v1-router";
import { makeDeleteGitRepositoryMongoRepository } from "@/adapter/repository/mongo/git-repository/delete-git-repository-mongo-repository";
import { makeFindGitRepositoriesMongoRepository } from "@/adapter/repository/mongo/git-repository/find-git-repositories-mongo-repository";
import { makeFindGitRepositoryByIdMongoRepository } from "@/adapter/repository/mongo/git-repository/find-git-repository-by-id-mongo-repository";
import { getGitRepositoryMongoCollection } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-collection";
import {
  gitRepositoryEntityToMongoModel,
  gitRepositoryMongoModelToEntity,
} from "@/adapter/repository/mongo/git-repository/git-repository-mongo-mapper";
import { makeInsertGitRepositoryMongoRepository } from "@/adapter/repository/mongo/git-repository/insert-git-repository-mongo-repository";
import { makeUpdateGitRepositoryMongoRepository } from "@/adapter/repository/mongo/git-repository/update-git-repository-mongo-repository";
import { makeCreateGitRepositoryUseCase } from "@/app/use-case/git-repository/create-git-repository-use-case";
import { makeDeleteGitRepositoryUseCase } from "@/app/use-case/git-repository/delete-git-repository-use-case";
import { makeGetGitRepositoryUseCase } from "@/app/use-case/git-repository/get-git-repository-use-case";
import { makeListGitRepositoriesUseCase } from "@/app/use-case/git-repository/list-git-repositories-use-case";
import { makeUpdateGitRepositoryUseCase } from "@/app/use-case/git-repository/update-git-repository-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertGitRepositoryMongoRepository =
  makeInsertGitRepositoryMongoRepository({
    getGitRepositoryMongoCollection,
    gitRepositoryEntityToMongoModel,
  });
export const findGitRepositoryByIdMongoRepository =
  makeFindGitRepositoryByIdMongoRepository({
    getGitRepositoryMongoCollection,
    gitRepositoryMongoModelToEntity,
  });
const findGitRepositoriesMongoRepository =
  makeFindGitRepositoriesMongoRepository({
    getGitRepositoryMongoCollection,
    gitRepositoryMongoModelToEntity,
  });
const updateGitRepositoryMongoRepository =
  makeUpdateGitRepositoryMongoRepository({
    getGitRepositoryMongoCollection,
  });
const deleteGitRepositoryMongoRepository =
  makeDeleteGitRepositoryMongoRepository({
    getGitRepositoryMongoCollection,
  });

// Use cases
export const createGitRepositoryUseCase = makeCreateGitRepositoryUseCase({
  insertGitRepositoryRepository: insertGitRepositoryMongoRepository,
});
export const getGitRepositoryUseCase = makeGetGitRepositoryUseCase({
  findGitRepositoryByIdRepository: findGitRepositoryByIdMongoRepository,
});
export const listGitRepositoriesUseCase = makeListGitRepositoriesUseCase({
  findGitRepositoriesRepository: findGitRepositoriesMongoRepository,
});
export const updateGitRepositoryUseCase = makeUpdateGitRepositoryUseCase({
  updateGitRepositoryRepository: updateGitRepositoryMongoRepository,
});
export const deleteGitRepositoryUseCase = makeDeleteGitRepositoryUseCase({
  deleteGitRepositoryRepository: deleteGitRepositoryMongoRepository,
});

export const gitRepositoryHttpV1Router = makeGitRepositoryHttpV1Router({
  getSession,
  getActiveMember,
  createGitRepositoryUseCase,
  deleteGitRepositoryUseCase,
  getGitRepositoryUseCase,
  gitRepositoryEntityToResponseDto,
  listGitRepositoriesUseCase,
  updateGitRepositoryUseCase,
});
