import { makeWorkflowActionDefinitionHttpV1Router } from "@/adapter/http/workflow/action-definition/workflow-action-definition-http-v1-router";
import { makeFindWorkflowActionDefinitionsStaticRepository } from "@/adapter/repository/static/workflow-action-definition/find-workflow-action-definitions-static-repository";
import { makeListWorkflowActionDefinitionsUseCase } from "@/app/use-case/workflow/list-workflow-action-definitions-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const findWorkflowActionDefinitionsStaticRepository =
  makeFindWorkflowActionDefinitionsStaticRepository();

// Use cases
export const listWorkflowActionDefinitionsUseCase =
  makeListWorkflowActionDefinitionsUseCase({
    findWorkflowActionDefinitionsRepository:
      findWorkflowActionDefinitionsStaticRepository,
  });

// Router
export const workflowActionDefinitionHttpV1Router =
  makeWorkflowActionDefinitionHttpV1Router({
    getSession,
    getActiveMember,
    listWorkflowActionDefinitionsUseCase,
  });
