import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { projectEntityProps } from "@/domain/entity/project/project-entity";

const projectCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createProjectUseCaseInputSchema = z.object({
  ctx: projectCtxSchema,
  payload: z.object({
    name: projectEntityProps.shape.name,
  }),
});

export const getProjectUseCaseInputSchema = z.object({
  ctx: projectCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listProjectsUseCaseInputSchema = z.object({
  ctx: projectCtxSchema,
});

export const updateProjectUseCaseInputSchema = z.object({
  ctx: projectCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    name: projectEntityProps.shape.name.optional(),
  }),
});

export const deleteProjectUseCaseInputSchema = z.object({
  ctx: projectCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
