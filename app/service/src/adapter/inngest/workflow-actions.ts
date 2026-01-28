import type { EngineAction } from "@inngest/workflow-kit";

export const workflowActions: EngineAction[] = [
  {
    kind: "research",
    name: "Research",
    description: "Research and gather information about a topic",
    handler: async ({ step, workflowAction }) => {
      return step.run(`research-${workflowAction.id}`, async () => {
        // TODO: Implement research action
        return {
          status: "completed",
          action: "research",
          inputs: workflowAction.inputs,
        };
      });
    },
  },
  {
    kind: "plan",
    name: "Plan",
    description: "Create an implementation plan",
    handler: async ({ step, workflowAction }) => {
      return step.run(`plan-${workflowAction.id}`, async () => {
        // TODO: Implement plan action
        return {
          status: "completed",
          action: "plan",
          inputs: workflowAction.inputs,
        };
      });
    },
  },
  {
    kind: "code",
    name: "Code",
    description: "Generate or modify code",
    handler: async ({ step, workflowAction }) => {
      return step.run(`code-${workflowAction.id}`, async () => {
        // TODO: Implement code action
        return {
          status: "completed",
          action: "code",
          inputs: workflowAction.inputs,
        };
      });
    },
  },
];
