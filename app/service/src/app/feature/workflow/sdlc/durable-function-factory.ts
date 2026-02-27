import type { WorkflowSdlcActionDefinitionCrudService } from "@/app/feature/workflow/sdlc/action-definition-service";
import {
  SDLC_WORKFLOW_FUNCTION_ID,
  SDLC_WORKFLOW_INIT_EVENT,
} from "@/app/feature/workflow/sdlc/constant";
import type { DurableFunctionFactory } from "@/core/infra/durable-function/factory";
import type { WorkflowEngineFactory } from "@/core/infra/workflow/engine/factory";

class WorkflowSdlcDurableFunctionFactory {
  #durableFunctionFactory: DurableFunctionFactory;
  #workflowEngineFactory: WorkflowEngineFactory;
  #workflowSdlcActionDefinitionCrudService: WorkflowSdlcActionDefinitionCrudService;

  constructor(
    durableFunctionFactory: DurableFunctionFactory,
    workflowEngineFactory: WorkflowEngineFactory,
    workflowSdlcActionDefinitionCrudService: WorkflowSdlcActionDefinitionCrudService,
  ) {
    this.#durableFunctionFactory = durableFunctionFactory;
    this.#workflowEngineFactory = workflowEngineFactory;
    this.#workflowSdlcActionDefinitionCrudService =
      workflowSdlcActionDefinitionCrudService;
  }

  make() {
    return this.#durableFunctionFactory.make({
      config: { id: SDLC_WORKFLOW_FUNCTION_ID },
      trigger: { event: SDLC_WORKFLOW_INIT_EVENT },
      handler: async (payload) => {
        const workflowActionDefinitionsResult =
          await this.#workflowSdlcActionDefinitionCrudService.list();

        if (workflowActionDefinitionsResult.isErr()) {
          return workflowActionDefinitionsResult;
        }
        const workflowEngine = await this.#workflowEngineFactory.make({
          workflowActionDefinitions: workflowActionDefinitionsResult.value,
        });

        await workflowEngine.run(payload);
      },
    });
  }
}

export { WorkflowSdlcDurableFunctionFactory as WorkflowSdlcFunctionFactory };
