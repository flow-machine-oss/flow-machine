import { inngestClient } from "@/old/client/inngest.client";
import { workflowEngine } from "@/old/inngest/workflow-engine.inngest";

export const workflowFunction = inngestClient.createFunction(
  { id: "workflow" },
  [{ event: "workflow.trigger" }],
  async ({ event, step }) => {
    await workflowEngine.run({ event, step });
  },
);
