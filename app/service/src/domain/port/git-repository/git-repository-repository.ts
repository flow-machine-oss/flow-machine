import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  GitRepositoryEntity,
  gitRepositoryEntityProps,
} from "@/domain/entity/git-repository/git-repository-entity";

const gitRepositoryRepositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertGitRepositoryRepositorySchema = z.function({
  input: [
    z.object({
      ctx: gitRepositoryRepositoryCtxSchema,
      data: z.instanceof(GitRepositoryEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertGitRepositoryRepository = z.output<
  typeof insertGitRepositoryRepositorySchema
>;

export const findGitRepositoryByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: gitRepositoryRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(GitRepositoryEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindGitRepositoryByIdRepository = z.output<
  typeof findGitRepositoryByIdRepositorySchema
>;

export const findGitRepositoriesRepositorySchema = z.function({
  input: [
    z.object({
      ctx: gitRepositoryRepositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(GitRepositoryEntity).array(),
      z.instanceof(Err),
    ),
  ),
});
export type FindGitRepositoriesRepository = z.output<
  typeof findGitRepositoriesRepositorySchema
>;

export const updateGitRepositoryRepositorySchema = z.function({
  input: [
    z.object({
      ctx: gitRepositoryRepositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        name: gitRepositoryEntityProps.shape.name.optional(),
        url: gitRepositoryEntityProps.shape.url.optional(),
        config: gitRepositoryEntityProps.shape.config.optional(),
        integration: gitRepositoryEntityProps.shape.integration.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateGitRepositoryRepository = z.output<
  typeof updateGitRepositoryRepositorySchema
>;

export const deleteGitRepositoryRepositorySchema = z.function({
  input: [
    z.object({
      ctx: gitRepositoryRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});

export type DeleteGitRepositoryRepository = z.output<
  typeof deleteGitRepositoryRepositorySchema
>;
