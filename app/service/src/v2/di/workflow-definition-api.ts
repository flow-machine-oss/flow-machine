import { WorkflowDefinitionV1HttpRouterFactory } from "@/v2/api/module/workflow/definition/v1/http-router-factory";
import { WorkflowDefinitionBasicCrudService } from "@/v2/app/domain/workflow/definition/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { WorkflowDefinitionMongoCrudRepository } from "@/v2/infra/mongo/workflow/definition/crud-repository";

const workflowDefinitionMongoCrudRepository =
  new WorkflowDefinitionMongoCrudRepository();
const workflowDefinitionBasicCrudService =
  new WorkflowDefinitionBasicCrudService(workflowDefinitionMongoCrudRepository);

const workflowDefinitionV1HttpRouterFactory =
  new WorkflowDefinitionV1HttpRouterFactory(
    httpAuthGuardFactory,
    httpRequestCtxFactory,
    workflowDefinitionBasicCrudService,
  );

export {
  workflowDefinitionBasicCrudService,
  workflowDefinitionV1HttpRouterFactory,
};
