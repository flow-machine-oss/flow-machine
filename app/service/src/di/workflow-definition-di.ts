import { makeWorkflowDefinitionHttpV1Router } from "@/adapter/http/workflow/definition/workflow-definition-http-v1-router";
import { makeDeleteWorkflowDefinitionMongoRepository } from "@/adapter/repository/mongo/workflow-definition/delete-workflow-definition-mongo-repository";
import { makeFindWorkflowDefinitionByIdMongoRepository } from "@/adapter/repository/mongo/workflow-definition/find-workflow-definition-by-id-mongo-repository";
import { makeFindWorkflowDefinitionsMongoRepository } from "@/adapter/repository/mongo/workflow-definition/find-workflow-definitions-mongo-repository";
import { makeInsertWorkflowDefinitionMongoRepository } from "@/adapter/repository/mongo/workflow-definition/insert-workflow-definition-mongo-repository";
import { makeUpdateWorkflowDefinitionMongoRepository } from "@/adapter/repository/mongo/workflow-definition/update-workflow-definition-mongo-repository";
import { getWorkflowDefinitionMongoCollection } from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-collection";
import {
  workflowDefinitionEntityToMongoModel,
  workflowDefinitionMongoModelToEntity,
} from "@/adapter/repository/mongo/workflow-definition/workflow-definition-mongo-mapper";
import { makeCreateWorkflowDefinitionUseCase } from "@/app/use-case/workflow/create-workflow-definition-use-case";
import { makeDeleteWorkflowDefinitionUseCase } from "@/app/use-case/workflow/delete-workflow-definition-use-case";
import { makeGetWorkflowDefinitionUseCase } from "@/app/use-case/workflow/get-workflow-definition-use-case";
import { makeListWorkflowDefinitionsUseCase } from "@/app/use-case/workflow/list-workflows-definition-use-case";
import { makeUpdateWorkflowDefinitionUseCase } from "@/app/use-case/workflow/update-workflow-definition-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertWorkflowDefinitionMongoRepository =
  makeInsertWorkflowDefinitionMongoRepository({
    getWorkflowDefinitionMongoCollection,
    workflowDefinitionEntityToMongoModel,
  });
export const findWorkflowDefinitionByIdMongoRepository =
  makeFindWorkflowDefinitionByIdMongoRepository({
    getWorkflowDefinitionMongoCollection,
    workflowDefinitionMongoModelToEntity,
  });
const findWorkflowDefinitionsMongoRepository =
  makeFindWorkflowDefinitionsMongoRepository({
    getWorkflowDefinitionMongoCollection,
    workflowDefinitionMongoModelToEntity,
  });
const updateWorkflowDefinitionMongoRepository =
  makeUpdateWorkflowDefinitionMongoRepository({
    getWorkflowDefinitionMongoCollection,
  });
const deleteWorkflowDefinitionMongoRepository =
  makeDeleteWorkflowDefinitionMongoRepository({
    getWorkflowDefinitionMongoCollection,
  });

// Use cases
export const createWorkflowDefinitionUseCase =
  makeCreateWorkflowDefinitionUseCase({
    insertWorkflowDefinitionRepository: insertWorkflowDefinitionMongoRepository,
  });
export const getWorkflowDefinitionUseCase = makeGetWorkflowDefinitionUseCase({
  findWorkflowDefinitionByIdRepository:
    findWorkflowDefinitionByIdMongoRepository,
});
export const listWorkflowDefinitionsUseCase =
  makeListWorkflowDefinitionsUseCase({
    findWorkflowDefinitionsRepository: findWorkflowDefinitionsMongoRepository,
  });
export const updateWorkflowDefinitionUseCase =
  makeUpdateWorkflowDefinitionUseCase({
    updateWorkflowDefinitionRepository: updateWorkflowDefinitionMongoRepository,
  });
export const deleteWorkflowDefinitionUseCase =
  makeDeleteWorkflowDefinitionUseCase({
    deleteWorkflowDefinitionRepository: deleteWorkflowDefinitionMongoRepository,
  });

export const workflowDefinitionHttpV1Router =
  makeWorkflowDefinitionHttpV1Router({
    getSession,
    getActiveMember,
    createWorkflowDefinitionUseCase,
    deleteWorkflowDefinitionUseCase,
    getWorkflowDefinitionUseCase,
    listWorkflowDefinitionsUseCase,
    updateWorkflowDefinitionUseCase,
  });
