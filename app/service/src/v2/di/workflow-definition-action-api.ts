import { WorkflowActionDefinitionV1HttpRouterFactory } from "@/v2/api/module/workflow/action/v1/http-router-factory";
import { WorkflowSdlcActionDefinitionCrudService } from "@/v2/app/feature/workflow/sdlc/action-definition-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";

const workflowDefinitionActionBasicCrudService =
  new WorkflowSdlcActionDefinitionCrudService();

const workflowDefinitionActionV1HttpRouterFactory =
  new WorkflowActionDefinitionV1HttpRouterFactory(
    httpAuthGuardFactory,
    httpRequestCtxFactory,
    workflowDefinitionActionBasicCrudService,
  );

export {
  workflowDefinitionActionBasicCrudService,
  workflowDefinitionActionV1HttpRouterFactory,
};
