import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  WorkflowEntity,
  workflowEntityProps,
} from "@/domain/entity/workflow/workflow-entity";

const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertWorkflowRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      data: z.instanceof(WorkflowEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertWorkflowRepository = z.output<
  typeof insertWorkflowRepositorySchema
>;

export const findWorkflowByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(WorkflowEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindWorkflowByIdRepository = z.output<
  typeof findWorkflowByIdRepositorySchema
>;

export const findWorkflowsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(WorkflowEntity)), z.instanceof(Err)),
  ),
});
export type FindWorkflowsRepository = z.output<
  typeof findWorkflowsRepositorySchema
>;

export const updateWorkflowRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        name: workflowEntityProps.shape.name.optional(),
        description: workflowEntityProps.shape.description,
        projectId: workflowEntityProps.shape.projectId.optional(),
        actions: workflowEntityProps.shape.actions.optional(),
        edges: workflowEntityProps.shape.edges.optional(),
        isActive: workflowEntityProps.shape.isActive.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateWorkflowRepository = z.output<
  typeof updateWorkflowRepositorySchema
>;

export const deleteWorkflowRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});

export type DeleteWorkflowRepository = z.output<
  typeof deleteWorkflowRepositorySchema
>;
