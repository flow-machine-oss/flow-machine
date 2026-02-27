import { InngestHttpRouterFactory } from "@/v2/api/module/inngest/http-router-factory";
import { WorkflowSdlcFunctionFactory } from "@/v2/app/feature/workflow/sdlc/function-factory";
import { workflowDefinitionActionBasicCrudService } from "@/v2/di/workflow-definition-action-api";
import { workflowDefinitionBasicCrudService } from "@/v2/di/workflow-definition-api";
import { InngestClientFactory } from "@/v2/infra/inngest/client-factory";
import { InngestFunctionFactory } from "@/v2/infra/inngest/function-factory";
import { InngestWorkflowEngineFactory } from "@/v2/infra/inngest/workflow/engine-factory";

const inngestClientFactory = new InngestClientFactory();
const inngestClient = inngestClientFactory.make();

const inngestFunctionFactory = new InngestFunctionFactory(inngestClient);
const inngestWorkflowEngineFactory = new InngestWorkflowEngineFactory(
  workflowDefinitionBasicCrudService,
);

const inngestWorkflowSdlcFunctionFactory = new WorkflowSdlcFunctionFactory(
  inngestFunctionFactory,
  inngestWorkflowEngineFactory,
  workflowDefinitionActionBasicCrudService,
);

const inngestHttpRouterFactory = new InngestHttpRouterFactory(inngestClient, [
  inngestWorkflowSdlcFunctionFactory.make(),
]);

export { inngestHttpRouterFactory };
