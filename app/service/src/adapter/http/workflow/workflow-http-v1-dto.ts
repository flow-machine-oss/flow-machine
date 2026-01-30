import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import {
  workflowActionSchema,
  workflowEdgeSchema,
  workflowEntityProps,
} from "@/domain/entity/workflow/workflow-entity";
import { createWorkflowUseCaseInputSchema } from "@/domain/port/workflow/workflow-dto";

export const postWorkflowRequestBodyDtoSchema = z.object({
  name: createWorkflowUseCaseInputSchema.shape.payload.shape.name,
  description: createWorkflowUseCaseInputSchema.shape.payload.shape.description,
  projectId: createWorkflowUseCaseInputSchema.shape.payload.shape.projectId,
  actions: createWorkflowUseCaseInputSchema.shape.payload.shape.actions,
  edges: createWorkflowUseCaseInputSchema.shape.payload.shape.edges,
  isActive: createWorkflowUseCaseInputSchema.shape.payload.shape.isActive,
});

export const patchWorkflowRequestBodyDtoSchema = z.object({
  name: workflowEntityProps.shape.name.optional(),
  description: workflowEntityProps.shape.description,
  projectId: workflowEntityProps.shape.projectId.optional(),
  actions: workflowEntityProps.shape.actions.optional(),
  edges: workflowEntityProps.shape.edges.optional(),
  isActive: workflowEntityProps.shape.isActive.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const workflowResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: workflowEntityProps.shape.name,
  description: workflowEntityProps.shape.description,
  projectId: workflowEntityProps.shape.projectId,
  actions: z.array(workflowActionSchema),
  edges: z.array(workflowEdgeSchema),
  isActive: workflowEntityProps.shape.isActive,
});

export type WorkflowResponseDto = z.output<typeof workflowResponseDtoSchema>;
