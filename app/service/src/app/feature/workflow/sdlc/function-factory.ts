import type { WorkflowSdlcActionDefinitionCrudService } from "@/app/feature/workflow/sdlc/action-definition-service";
import type { WorkflowEngineFactory } from "@/core/domain/workflow/engine/factory";
import type { WorkflowFunctionFactory } from "@/core/domain/workflow/function/factory";
import {
  SDLC_WORKFLOW_FUNCTION_ID,
  SDLC_WORKFLOW_INIT_EVENT,
} from "@/core/feature/workflow/constant";

class WorkflowSdlcFunctionFactory {
  #workflowFunctionFactory: WorkflowFunctionFactory;
  #workflowEngineFactory: WorkflowEngineFactory;
  #workflowSdlcActionDefinitionCrudService: WorkflowSdlcActionDefinitionCrudService;

  constructor(
    workflowFunctionFactory: WorkflowFunctionFactory,
    workflowEngineFactory: WorkflowEngineFactory,
    workflowSdlcActionDefinitionCrudService: WorkflowSdlcActionDefinitionCrudService,
  ) {
    this.#workflowFunctionFactory = workflowFunctionFactory;
    this.#workflowEngineFactory = workflowEngineFactory;
    this.#workflowSdlcActionDefinitionCrudService =
      workflowSdlcActionDefinitionCrudService;
  }

  make() {
    return this.#workflowFunctionFactory.make({
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

export { WorkflowSdlcFunctionFactory };
