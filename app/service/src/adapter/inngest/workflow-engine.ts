import { Engine } from "@inngest/workflow-kit";
import { workflowActions } from "@/adapter/inngest/workflow-actions";
import { config } from "@/common/config/config";
import { mongoClient } from "@/common/mongo/mongo-client";
import type { FindWorkflowByIdRepository } from "@/domain/port/workflow/workflow-repository";

type Input = {
  findWorkflowByIdRepository: FindWorkflowByIdRepository;
};

export const makeWorkflowEngine = ({ findWorkflowByIdRepository }: Input) =>
  new Engine({
    actions: workflowActions,
    loader: async (event) => {
      const { workflowId, tenantId } = event.data as {
        workflowId: string;
        tenantId: string;
      };

      const result = await findWorkflowByIdRepository({
        ctx: {
          mongoDb: mongoClient.db(config.database.name),
          mongoClientSession: mongoClient.startSession(),
          tenantId,
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
