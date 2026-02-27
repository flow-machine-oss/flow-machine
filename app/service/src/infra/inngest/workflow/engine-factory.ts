import { Engine, type EngineAction } from "@inngest/workflow-kit";
import type { MongoClient } from "mongodb";
import type z from "zod";
import { makeMongoCtx } from "@/common/ctx/mongo-ctx";
import type { Tenant } from "@/core/domain/tenant-aware-entity";
import type { WorkflowActionDefinitionEntity } from "@/core/domain/workflow/definition/action/entity";
import type { WorkflowDefinitionCrudService } from "@/core/domain/workflow/definition/crud-service";
import type { ConfigService } from "@/core/infra/config/service";
import type {
  WorkflowEngineFactory,
  workflowEngineFactoryInputSchema,
} from "@/core/infra/workflow/engine/factory";
import type { WorkflowEngine } from "@/core/infra/workflow/engine/type";

class InngestWorkflowEngineFactory implements WorkflowEngineFactory {
  #workflowDefinitionCrudService: WorkflowDefinitionCrudService;
  #mongoClient: MongoClient;
  #configService: ConfigService;

  constructor(
    workflowDefinitionCrudService: WorkflowDefinitionCrudService,
    mongoClient: MongoClient,
    configService: ConfigService,
  ) {
    this.#workflowDefinitionCrudService = workflowDefinitionCrudService;
    this.#mongoClient = mongoClient;
    this.#configService = configService;
  }

  async make(
    input: z.infer<typeof workflowEngineFactoryInputSchema.make>,
  ): Promise<WorkflowEngine> {
    const { workflowActionDefinitions } = input;

    return new Engine({
      actions: workflowActionDefinitions.map(
        this.#toInngestWorkflowActionDefinition,
      ),
      loader: async (event) => {
        const { workflowDefinitionId, tenant } = event.data as {
          workflowDefinitionId: string;
          tenant: Tenant;
        };

        const result = await this.#workflowDefinitionCrudService.get({
          ctx: {
            mongoDb: makeMongoCtx(
              this.#mongoClient,
              this.#configService.get("database.name"),
            ).mongoDb,
            tenant,
          },
          payload: { id: workflowDefinitionId },
        });

        if (result.isErr()) {
          return null;
        }
        const workflow = result.value;

        return {
          name: workflow.props.name,
          description: workflow.props.description,
          actions: workflow.props.actions,
          edges: workflow.props.edges,
        };
      },
    });
  }

  #toInngestWorkflowActionDefinition(
    workflowActionDefinition: WorkflowActionDefinitionEntity,
  ) {
    return {
      kind: workflowActionDefinition.props.kind,
      name: workflowActionDefinition.props.name,
      handler: workflowActionDefinition.props.handler,
    } satisfies EngineAction;
  }
}

export { InngestWorkflowEngineFactory };
