import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { gitRepositoryEntityProps } from "@/domain/entity/git-repository/git-repository-entity";
import { createGitRepositoryUseCaseInputSchema } from "@/domain/port/git-repository/git-repository-dto";

export const postGitRepositoryRequestBodyDtoSchema = z.object({
  name: createGitRepositoryUseCaseInputSchema.shape.payload.shape.name,
  url: createGitRepositoryUseCaseInputSchema.shape.payload.shape.url,
  config: createGitRepositoryUseCaseInputSchema.shape.payload.shape.config,
  integration:
    createGitRepositoryUseCaseInputSchema.shape.payload.shape.integration,
});

export const patchGitRepositoryRequestBodyDtoSchema = z.object({
  name: gitRepositoryEntityProps.shape.name.optional(),
  url: gitRepositoryEntityProps.shape.url.optional(),
  config: gitRepositoryEntityProps.shape.config.optional(),
  integration: gitRepositoryEntityProps.shape.integration.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const gitRepositoryResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: gitRepositoryEntityProps.shape.name,
  url: gitRepositoryEntityProps.shape.url,
  config: gitRepositoryEntityProps.shape.config,
  integration: gitRepositoryEntityProps.shape.integration,
});

export type GitRepositoryResponseDto = z.output<
  typeof gitRepositoryResponseDtoSchema
>;
