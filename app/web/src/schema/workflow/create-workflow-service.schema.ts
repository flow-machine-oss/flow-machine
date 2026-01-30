import { z } from "zod/v4";
import {
  workflowActionSchema,
  workflowEdgeSchema,
} from "./workflow-service.schema";

export const createWorkflowRequestBodyDtoSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  projectId: z.string().nullable(),
  actions: z.array(workflowActionSchema),
  edges: z.array(workflowEdgeSchema),
  isActive: z.boolean(),
});

export type CreateWorkflowRequestBodyDto = z.input<
  typeof createWorkflowRequestBodyDtoSchema
>;
