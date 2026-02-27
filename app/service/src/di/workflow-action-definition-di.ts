import { makeWorkflowActionDefinitionHttpV1Router } from "@/adapter/http/workflow-action-definition/workflow-action-definition-http-v1-router";
import { makeListWorkflowActionDefinitionsUseCase } from "@/app/use-case/workflow-action-definition/list-workflow-action-definitions-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Use cases
export const listWorkflowActionDefinitionsUseCase =
  makeListWorkflowActionDefinitionsUseCase();

// Router
export const workflowActionDefinitionHttpV1Router =
  makeWorkflowActionDefinitionHttpV1Router({
    getSession,
    getActiveMember,
    listWorkflowActionDefinitionsUseCase,
  });
