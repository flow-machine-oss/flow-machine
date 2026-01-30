import { Engine } from "@inngest/workflow-kit";
import { workflowActions } from "@/adapter/inngest/workflow-actions";
import { config } from "@/common/config/config";
import { mongoClient } from "@/common/mongo/mongo-client";
import type { Tenant } from "@/common/domain/tenant-aware-entity";
import type { FindWorkflowByIdRepository } from "@/domain/port/workflow/workflow-repository";

type Input = {
  findWorkflowByIdRepository: FindWorkflowByIdRepository;
};

export const makeWorkflowEngine = ({ findWorkflowByIdRepository }: Input) =>
  new Engine({
    actions: workflowActions,
    loader: async (event) => {
      const { workflowId, tenant } = event.data as {
        workflowId: string;
        tenant: Tenant;
      };

      const result = await findWorkflowByIdRepository({
        ctx: {
          mongoDb: mongoClient.db(config.database.name),
          mongoClientSession: mongoClient.startSession(),
          tenant,
        },
        id: workflowId,
      });

      if (result.isErr() || result.value === null) {
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
