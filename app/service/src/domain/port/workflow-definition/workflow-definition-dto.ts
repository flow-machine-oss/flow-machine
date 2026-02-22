import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { workflowDefinitionEntityProps } from "@/domain/entity/workflow-definition/workflow-definition-entity";

const workflowDefinitionCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createWorkflowDefinitionUseCaseInputSchema = z.object({
  ctx: workflowDefinitionCtxSchema,
  payload: z.object({
    name: workflowDefinitionEntityProps.shape.name,
    description: workflowDefinitionEntityProps.shape.description,
    projectId: workflowDefinitionEntityProps.shape.projectId,
    actions: workflowDefinitionEntityProps.shape.actions,
    edges: workflowDefinitionEntityProps.shape.edges,
    isActive: workflowDefinitionEntityProps.shape.isActive,
  }),
});

export const getWorkflowDefinitionUseCaseInputSchema = z.object({
  ctx: workflowDefinitionCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listWorkflowDefinitionsUseCaseInputSchema = z.object({
  ctx: workflowDefinitionCtxSchema,
});

export const updateWorkflowDefinitionUseCaseInputSchema = z.object({
  ctx: workflowDefinitionCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    name: workflowDefinitionEntityProps.shape.name.optional(),
    description: workflowDefinitionEntityProps.shape.description,
    projectId: workflowDefinitionEntityProps.shape.projectId.optional(),
    actions: workflowDefinitionEntityProps.shape.actions.optional(),
    edges: workflowDefinitionEntityProps.shape.edges.optional(),
    isActive: workflowDefinitionEntityProps.shape.isActive.optional(),
  }),
});

export const deleteWorkflowDefinitionUseCaseInputSchema = z.object({
  ctx: workflowDefinitionCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
