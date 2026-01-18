import { inngestClient } from "@/client/inngest/inngest.client";
import { workflowEngine } from "@/inngest/workflow-engine.inngest";

export const workflowFunction = inngestClient.createFunction(
  { id: "workflow" },
  [{ event: "workflow.trigger" }],
  async ({ event, step }) => {
    await workflowEngine.run({ event, step });
  },
);
