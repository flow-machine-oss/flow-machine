import { z } from "zod/v4";
import { tenantAwareBaseDtoSchema } from "@/schema/shared.schema";

export const workflowActionSchema = z.object({
  id: z.string(),
  kind: z.string(),
  name: z.string(),
  inputs: z.record(z.string(), z.unknown()).optional(),
});

export const workflowEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const workflowDefinitionResponseDtoSchema = z.object({
  ...tenantAwareBaseDtoSchema.shape,
  name: z.string(),
  description: z.string().optional(),
  projectId: z.string().nullable(),
  actions: z.array(workflowActionSchema),
  edges: z.array(workflowEdgeSchema),
  isActive: z.boolean(),
});

export type WorkflowDefinitionResponseDto = z.output<
  typeof workflowDefinitionResponseDtoSchema
>;
export type WorkflowAction = z.output<typeof workflowActionSchema>;
export type WorkflowEdge = z.output<typeof workflowEdgeSchema>;
