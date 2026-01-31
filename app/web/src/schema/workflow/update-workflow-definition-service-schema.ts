import { z } from "zod/v4";
import {
  workflowActionSchema,
  workflowEdgeSchema,
} from "./workflow-definition-service-schema";

export const updateWorkflowDefinitionRequestBodyDtoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  projectId: z.string().nullable().optional(),
  actions: z.array(workflowActionSchema).optional(),
  edges: z.array(workflowEdgeSchema).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateWorkflowDefinitionRequestBodyDto = z.input<
  typeof updateWorkflowDefinitionRequestBodyDtoSchema
>;
