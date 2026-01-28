import { makeWorkflowHttpV1Router } from "@/adapter/http/workflow/workflow-http-v1-router";
import { makeDeleteWorkflowMongoRepository } from "@/adapter/repository/workflow/delete-workflow-mongo-repository";
import { makeFindWorkflowByIdMongoRepository } from "@/adapter/repository/workflow/find-workflow-by-id-mongo-repository";
import { makeFindWorkflowsMongoRepository } from "@/adapter/repository/workflow/find-workflows-mongo-repository";
import { makeInsertWorkflowMongoRepository } from "@/adapter/repository/workflow/insert-workflow-mongo-repository";
import { makeUpdateWorkflowMongoRepository } from "@/adapter/repository/workflow/update-workflow-mongo-repository";
import { getWorkflowMongoCollection } from "@/adapter/repository/workflow/workflow-mongo-collection";
import { makeCreateWorkflowUseCase } from "@/app/use-case/workflow/create-workflow-use-case";
import { makeDeleteWorkflowUseCase } from "@/app/use-case/workflow/delete-workflow-use-case";
import { makeGetWorkflowUseCase } from "@/app/use-case/workflow/get-workflow-use-case";
import { makeListWorkflowsUseCase } from "@/app/use-case/workflow/list-workflows-use-case";
import { makeUpdateWorkflowUseCase } from "@/app/use-case/workflow/update-workflow-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertWorkflowMongoRepository = makeInsertWorkflowMongoRepository({
  getWorkflowMongoCollection,
});
export const findWorkflowByIdMongoRepository =
  makeFindWorkflowByIdMongoRepository({
    getWorkflowMongoCollection,
  });
const findWorkflowsMongoRepository = makeFindWorkflowsMongoRepository({
  getWorkflowMongoCollection,
});
const updateWorkflowMongoRepository = makeUpdateWorkflowMongoRepository({
  getWorkflowMongoCollection,
});
const deleteWorkflowMongoRepository = makeDeleteWorkflowMongoRepository({
  getWorkflowMongoCollection,
});

// Use cases
export const createWorkflowUseCase = makeCreateWorkflowUseCase({
  insertWorkflowRepository: insertWorkflowMongoRepository,
});
export const getWorkflowUseCase = makeGetWorkflowUseCase({
  findWorkflowByIdRepository: findWorkflowByIdMongoRepository,
});
export const listWorkflowsUseCase = makeListWorkflowsUseCase({
  findWorkflowsRepository: findWorkflowsMongoRepository,
});
export const updateWorkflowUseCase = makeUpdateWorkflowUseCase({
  updateWorkflowRepository: updateWorkflowMongoRepository,
});
export const deleteWorkflowUseCase = makeDeleteWorkflowUseCase({
  deleteWorkflowRepository: deleteWorkflowMongoRepository,
});

export const workflowHttpV1Router = makeWorkflowHttpV1Router({
  getSession,
  getActiveMember,
  createWorkflowUseCase,
  deleteWorkflowUseCase,
  getWorkflowUseCase,
  listWorkflowsUseCase,
  updateWorkflowUseCase,
});
