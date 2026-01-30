import { makeProjectHttpV1Router } from "@/adapter/http/project/project-http-v1-router";
import { makeDeleteProjectMongoRepository } from "@/adapter/repository/project/delete-project-mongo-repository";
import { makeFindProjectByIdMongoRepository } from "@/adapter/repository/project/find-project-by-id-mongo-repository";
import { makeFindProjectsMongoRepository } from "@/adapter/repository/project/find-projects-mongo-repository";
import { makeInsertProjectMongoRepository } from "@/adapter/repository/project/insert-project-mongo-repository";
import { getProjectMongoCollection } from "@/adapter/repository/project/project-mongo-collection";
import { makeUpdateProjectMongoRepository } from "@/adapter/repository/project/update-project-mongo-repository";
import { makeCreateProjectUseCase } from "@/app/use-case/project/create-project-use-case";
import { makeDeleteProjectUseCase } from "@/app/use-case/project/delete-project-use-case";
import { makeGetProjectUseCase } from "@/app/use-case/project/get-project-use-case";
import { makeListProjectsUseCase } from "@/app/use-case/project/list-projects-use-case";
import { makeUpdateProjectUseCase } from "@/app/use-case/project/update-project-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertProjectMongoRepository = makeInsertProjectMongoRepository({
  getProjectMongoCollection,
});
const findProjectByIdMongoRepository = makeFindProjectByIdMongoRepository({
  getProjectMongoCollection,
});
const findProjectsMongoRepository = makeFindProjectsMongoRepository({
  getProjectMongoCollection,
});
const updateProjectMongoRepository = makeUpdateProjectMongoRepository({
  getProjectMongoCollection,
});
const deleteProjectMongoRepository = makeDeleteProjectMongoRepository({
  getProjectMongoCollection,
});

// Use cases
export const createProjectUseCase = makeCreateProjectUseCase({
  insertProjectRepository: insertProjectMongoRepository,
});
export const getProjectUseCase = makeGetProjectUseCase({
  findProjectByIdRepository: findProjectByIdMongoRepository,
});
export const listProjectsUseCase = makeListProjectsUseCase({
  findProjectsRepository: findProjectsMongoRepository,
});
export const updateProjectUseCase = makeUpdateProjectUseCase({
  updateProjectRepository: updateProjectMongoRepository,
});
export const deleteProjectUseCase = makeDeleteProjectUseCase({
  deleteProjectRepository: deleteProjectMongoRepository,
});

export const projectHttpV1Router = makeProjectHttpV1Router({
  getSession,
  getActiveMember,
  createProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase,
  listProjectsUseCase,
  updateProjectUseCase,
});
