import { WorkflowActionDefinitionV1HttpRouterFactory } from "@/api/module/workflow/action/v1/http-router-factory";
import { WorkflowSdlcActionDefinitionCrudService } from "@/app/feature/workflow/sdlc/action-definition-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/di/shared";

const workflowActionDefinitionBasicCrudService =
  new WorkflowSdlcActionDefinitionCrudService();

const workflowActionDefinitionV1HttpRouterFactory =
  new WorkflowActionDefinitionV1HttpRouterFactory(
    httpAuthGuardFactory,
    httpRequestCtxFactory,
    workflowActionDefinitionBasicCrudService,
  );

export {
  workflowActionDefinitionBasicCrudService,
  workflowActionDefinitionV1HttpRouterFactory,
};
