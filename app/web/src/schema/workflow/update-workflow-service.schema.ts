import { z } from "zod/v4";
import {
  workflowActionSchema,
  workflowEdgeSchema,
} from "./workflow-service.schema";

export const updateWorkflowRequestBodyDtoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  projectId: z.string().nullable().optional(),
  actions: z.array(workflowActionSchema).optional(),
  edges: z.array(workflowEdgeSchema).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateWorkflowRequestBodyDto = z.input<
  typeof updateWorkflowRequestBodyDtoSchema
>;
