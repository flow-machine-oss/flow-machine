import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  WorkflowDefinitionEntity,
  workflowDefinitionEntityProps,
} from "@/domain/entity/workflow-definition/workflow-definition-entity";

const workflowDefinitionRepositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertWorkflowDefinitionRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowDefinitionRepositoryCtxSchema,
      data: z.instanceof(WorkflowDefinitionEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertWorkflowDefinitionRepository = z.output<
  typeof insertWorkflowDefinitionRepositorySchema
>;

export const findWorkflowDefinitionByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowDefinitionRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(WorkflowDefinitionEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindWorkflowDefinitionByIdRepository = z.output<
  typeof findWorkflowDefinitionByIdRepositorySchema
>;

export const findWorkflowDefinitionsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowDefinitionRepositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(WorkflowDefinitionEntity).array(),
      z.instanceof(Err),
    ),
  ),
});
export type FindWorkflowDefinitionsRepository = z.output<
  typeof findWorkflowDefinitionsRepositorySchema
>;

export const updateWorkflowDefinitionRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowDefinitionRepositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        name: workflowDefinitionEntityProps.shape.name.optional(),
        description: workflowDefinitionEntityProps.shape.description,
        projectId: workflowDefinitionEntityProps.shape.projectId.optional(),
        actions: workflowDefinitionEntityProps.shape.actions.optional(),
        edges: workflowDefinitionEntityProps.shape.edges.optional(),
        isActive: workflowDefinitionEntityProps.shape.isActive.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateWorkflowDefinitionRepository = z.output<
  typeof updateWorkflowDefinitionRepositorySchema
>;

export const deleteWorkflowDefinitionRepositorySchema = z.function({
  input: [
    z.object({
      ctx: workflowDefinitionRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});

export type DeleteWorkflowDefinitionRepository = z.output<
  typeof deleteWorkflowDefinitionRepositorySchema
>;
