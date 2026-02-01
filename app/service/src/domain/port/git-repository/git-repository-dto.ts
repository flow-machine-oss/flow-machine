import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { gitRepositoryEntityProps } from "@/domain/entity/git-repository/git-repository-entity";

const gitRepositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createGitRepositoryUseCaseInputSchema = z.object({
  ctx: gitRepositoryCtxSchema,
  payload: z.object({
    name: gitRepositoryEntityProps.shape.name,
    url: gitRepositoryEntityProps.shape.url,
    config: gitRepositoryEntityProps.shape.config,
    integration: gitRepositoryEntityProps.shape.integration,
  }),
});

export const getGitRepositoryUseCaseInputSchema = z.object({
  ctx: gitRepositoryCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listGitRepositoriesUseCaseInputSchema = z.object({
  ctx: gitRepositoryCtxSchema,
});

export const updateGitRepositoryUseCaseInputSchema = z.object({
  ctx: gitRepositoryCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    name: gitRepositoryEntityProps.shape.name.optional(),
    url: gitRepositoryEntityProps.shape.url.optional(),
    config: gitRepositoryEntityProps.shape.config.optional(),
    integration: gitRepositoryEntityProps.shape.integration.optional(),
  }),
});

export const deleteGitRepositoryUseCaseInputSchema = z.object({
  ctx: gitRepositoryCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
