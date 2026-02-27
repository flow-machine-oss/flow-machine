import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import { ProjectEntity } from "@/core/domain/project/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const projectCrudRepositoryInputSchema = {
  insert: z.object({
    ctx: ctxSchema,
    data: z.instanceof(ProjectEntity),
  }),

  findOne: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),

  findMany: z.object({
    ctx: ctxSchema,
  }),

  update: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
    data: z.instanceof(ProjectEntity),
  }),

  delete: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),
};

interface ProjectCrudRepository {
  insert(
    input: z.infer<typeof projectCrudRepositoryInputSchema.insert>,
  ): Promise<Result<void, Err>>;
  findOne(
    input: z.infer<typeof projectCrudRepositoryInputSchema.findOne>,
  ): Promise<Result<ProjectEntity | null, Err>>;
  findMany(
    input: z.infer<typeof projectCrudRepositoryInputSchema.findMany>,
  ): Promise<Result<ProjectEntity[], Err>>;
  update(
    input: z.infer<typeof projectCrudRepositoryInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof projectCrudRepositoryInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export { type ProjectCrudRepository, projectCrudRepositoryInputSchema };
