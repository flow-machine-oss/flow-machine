import type { EngineAction, PublicEngineAction } from "@inngest/workflow-kit";
import { asyncNoop } from "es-toolkit";
import {
  WORKFLOW_ACTION_IMPLEMENT_KIND,
  WORKFLOW_ACTION_IMPLEMENT_NAME,
} from "@/inngest/constant.inngest";

const implementWorkflowAction = {
  kind: WORKFLOW_ACTION_IMPLEMENT_KIND,
  name: WORKFLOW_ACTION_IMPLEMENT_NAME,
} as const satisfies PublicEngineAction;

export const publicWorkflowActions = [
  implementWorkflowAction,
] as const satisfies PublicEngineAction[];

export const workflowActions = [
  { ...implementWorkflowAction, handler: asyncNoop },
] as const satisfies EngineAction[];
