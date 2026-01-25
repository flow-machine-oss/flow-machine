import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  ProjectEntity,
  projectEntityProps,
} from "@/domain/entity/project/project-entity";

const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertProjectRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      data: z.instanceof(ProjectEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertProjectRepository = z.output<
  typeof insertProjectRepositorySchema
>;

export const findProjectByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.instanceof(ProjectEntity).nullable(), z.instanceof(Err)),
  ),
});
export type FindProjectByIdRepository = z.output<
  typeof findProjectByIdRepositorySchema
>;

export const findProjectsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(ProjectEntity)), z.instanceof(Err)),
  ),
});
export type FindProjectsRepository = z.output<
  typeof findProjectsRepositorySchema
>;

export const updateProjectRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        name: projectEntityProps.shape.name.optional(),
        integration: projectEntityProps.shape.integration.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateProjectRepository = z.output<
  typeof updateProjectRepositorySchema
>;

export const deleteProjectRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteProjectRepository = z.output<
  typeof deleteProjectRepositorySchema
>;
