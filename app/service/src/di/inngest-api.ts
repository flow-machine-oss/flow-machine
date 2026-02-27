import { InngestHttpRouterFactory } from "@/api/module/inngest/http-router-factory";
import { WorkflowSdlcFunctionFactory } from "@/app/feature/workflow/sdlc/durable-function-factory";
import { workflowActionDefinitionBasicCrudService } from "@/di/workflow-action-definition-api";
import { workflowDefinitionBasicCrudService } from "@/di/workflow-definition-api";
import { InngestClientFactory } from "@/infra/inngest/client-factory";
import { InngestFunctionFactory } from "@/infra/inngest/function-factory";
import { InngestWorkflowEngineFactory } from "@/infra/inngest/workflow/engine-factory";

const inngestClientFactory = new InngestClientFactory();
const inngestClient = inngestClientFactory.make();

const inngestFunctionFactory = new InngestFunctionFactory(inngestClient);
const inngestWorkflowEngineFactory = new InngestWorkflowEngineFactory(
  workflowDefinitionBasicCrudService,
);

const inngestWorkflowSdlcFunctionFactory = new WorkflowSdlcFunctionFactory(
  inngestFunctionFactory,
  inngestWorkflowEngineFactory,
  workflowActionDefinitionBasicCrudService,
);

const inngestHttpRouterFactory = new InngestHttpRouterFactory(inngestClient, [
  inngestWorkflowSdlcFunctionFactory.make(),
]);

export { inngestHttpRouterFactory };
