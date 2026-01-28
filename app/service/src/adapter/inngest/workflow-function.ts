import type { Engine } from "@inngest/workflow-kit";
import type { InngestFunction } from "inngest";
import { inngest } from "@/adapter/inngest/inngest-client";

type Input = {
  workflowEngine: Engine;
};

export const makeWorkflowFunction = ({
  workflowEngine,
}: Input): InngestFunction.Any =>
  inngest.createFunction(
    { id: "agentic-workflow-executor" },
    { event: "agentic-workflow.start" },
    async ({ event, step }) => workflowEngine.run({ event, step }),
  );
