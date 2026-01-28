import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { workflowEntityProps } from "@/domain/entity/workflow/workflow-entity";

const workflowCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createWorkflowUseCaseInputSchema = z.object({
  ctx: workflowCtxSchema,
  payload: z.object({
    name: workflowEntityProps.shape.name,
    description: workflowEntityProps.shape.description,
    projectId: workflowEntityProps.shape.projectId,
    actions: workflowEntityProps.shape.actions,
    edges: workflowEntityProps.shape.edges,
    isActive: workflowEntityProps.shape.isActive,
  }),
});

export const getWorkflowUseCaseInputSchema = z.object({
  ctx: workflowCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listWorkflowsUseCaseInputSchema = z.object({
  ctx: workflowCtxSchema,
});

export const updateWorkflowUseCaseInputSchema = z.object({
  ctx: workflowCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    name: workflowEntityProps.shape.name.optional(),
    description: workflowEntityProps.shape.description,
    projectId: workflowEntityProps.shape.projectId.optional(),
    actions: workflowEntityProps.shape.actions.optional(),
    edges: workflowEntityProps.shape.edges.optional(),
    isActive: workflowEntityProps.shape.isActive.optional(),
  }),
});

export const deleteWorkflowUseCaseInputSchema = z.object({
  ctx: workflowCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
