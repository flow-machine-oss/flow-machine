import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { workflowDefinitionCrudServiceInputSchema } from "@/core/domain/workflow/definition/crud-service";
import {
  workflowActionSchema,
  workflowDefinitionEntityProps,
  workflowEdgeSchema,
} from "@/core/domain/workflow/definition/entity";

const workflowDefinitionResponseDtoSchema = z.object({
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
type WorkflowDefinitionResponseDto = z.output<
  typeof workflowDefinitionResponseDtoSchema
>;

const postWorkflowDefinitionRequestBodyDtoSchema = z.object({
  name: workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape
    .name,
  description:
    workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape
      .description,
  projectId:
    workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape
      .projectId,
  actions:
    workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape.actions,
  edges:
    workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape.edges,
  isActive:
    workflowDefinitionCrudServiceInputSchema.create.shape.payload.shape
      .isActive,
});

const patchWorkflowDefinitionRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const patchWorkflowDefinitionRequestBodyDtoSchema = z.object({
  name: workflowDefinitionEntityProps.shape.name.optional(),
  description: workflowDefinitionEntityProps.shape.description,
  projectId: workflowDefinitionEntityProps.shape.projectId.optional(),
  actions: workflowDefinitionEntityProps.shape.actions.optional(),
  edges: workflowDefinitionEntityProps.shape.edges.optional(),
  isActive: workflowDefinitionEntityProps.shape.isActive.optional(),
});

const deleteWorkflowDefinitionRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export {
  workflowDefinitionResponseDtoSchema,
  type WorkflowDefinitionResponseDto,
  postWorkflowDefinitionRequestBodyDtoSchema,
  patchWorkflowDefinitionRequestParamsDtoSchema,
  patchWorkflowDefinitionRequestBodyDtoSchema,
  deleteWorkflowDefinitionRequestParamsDtoSchema,
};
