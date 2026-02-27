import { WorkflowDefinitionV1HttpRouterFactory } from "@/api/module/workflow/definition/v1/http-router-factory";
import { WorkflowDefinitionBasicCrudService } from "@/app/domain/workflow/definition/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/di/shared";
import { WorkflowDefinitionMongoCrudRepository } from "@/infra/mongo/workflow/definition/crud-repository";

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
