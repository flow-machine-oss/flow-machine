import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { gitRepositoryCrudServiceInputSchema } from "@/v2/core/domain/git-repository/crud-service";
import { gitRepositoryEntityProps } from "@/v2/core/domain/git-repository/entity";

const gitRepositoryResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: gitRepositoryEntityProps.shape.name,
  url: gitRepositoryEntityProps.shape.url,
  config: gitRepositoryEntityProps.shape.config,
  integration: gitRepositoryEntityProps.shape.integration,
});
type GitRepositoryResponseDto = z.output<typeof gitRepositoryResponseDtoSchema>;

const postGitRepositoryRequestBodyDtoSchema = z.object({
  name: gitRepositoryCrudServiceInputSchema.create.shape.payload.shape.name,
  url: gitRepositoryCrudServiceInputSchema.create.shape.payload.shape.url,
  config: gitRepositoryCrudServiceInputSchema.create.shape.payload.shape.config,
  integration:
    gitRepositoryCrudServiceInputSchema.create.shape.payload.shape.integration,
});

const patchGitRepositoryRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const patchGitRepositoryRequestBodyDtoSchema = z.object({
  name: gitRepositoryEntityProps.shape.name.optional(),
  url: gitRepositoryEntityProps.shape.url.optional(),
  config: gitRepositoryEntityProps.shape.config.optional(),
  integration: gitRepositoryEntityProps.shape.integration.optional(),
});

const deleteGitRepositoryRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export {
  gitRepositoryResponseDtoSchema,
  type GitRepositoryResponseDto,
  postGitRepositoryRequestBodyDtoSchema,
  patchGitRepositoryRequestParamsDtoSchema,
  patchGitRepositoryRequestBodyDtoSchema,
  deleteGitRepositoryRequestParamsDtoSchema,
};
