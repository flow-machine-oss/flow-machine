import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import {
  workflowActionSchema,
  workflowDefinitionEntityProps,
  workflowEdgeSchema,
} from "@/domain/entity/workflow-definition/workflow-definition-entity";
import { createWorkflowDefinitionUseCaseInputSchema } from "@/domain/port/workflow-definition/workflow-definition-dto";

export const postWorkflowDefinitionRequestBodyDtoSchema = z.object({
  name: createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.name,
  description:
    createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.description,
  projectId:
    createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.projectId,
  actions:
    createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.actions,
  edges: createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.edges,
  isActive:
    createWorkflowDefinitionUseCaseInputSchema.shape.payload.shape.isActive,
});

export const patchWorkflowDefinitionRequestBodyDtoSchema = z.object({
  name: workflowDefinitionEntityProps.shape.name.optional(),
  description: workflowDefinitionEntityProps.shape.description,
  projectId: workflowDefinitionEntityProps.shape.projectId.optional(),
  actions: workflowDefinitionEntityProps.shape.actions.optional(),
  edges: workflowDefinitionEntityProps.shape.edges.optional(),
  isActive: workflowDefinitionEntityProps.shape.isActive.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const workflowDefinitionResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: workflowDefinitionEntityProps.shape.name,
  description: workflowDefinitionEntityProps.shape.description,
  projectId: workflowDefinitionEntityProps.shape.projectId,
  actions: z.array(workflowActionSchema),
  edges: z.array(workflowEdgeSchema),
  isActive: workflowDefinitionEntityProps.shape.isActive,
});

export type WorkflowDefinitionResponseDto = z.output<
  typeof workflowDefinitionResponseDtoSchema
>;
