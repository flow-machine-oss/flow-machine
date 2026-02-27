import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import { DocumentEntity } from "@/core/domain/document/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const documentCrudRepositoryInputSchema = {
  insert: z.object({
    ctx: ctxSchema,
    data: z.instanceof(DocumentEntity),
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
    data: z.instanceof(DocumentEntity),
  }),

  delete: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),
};

interface DocumentCrudRepository {
  insert(
    input: z.infer<typeof documentCrudRepositoryInputSchema.insert>,
  ): Promise<Result<void, Err>>;
  findOne(
    input: z.infer<typeof documentCrudRepositoryInputSchema.findOne>,
  ): Promise<Result<DocumentEntity | null, Err>>;
  findMany(
    input: z.infer<typeof documentCrudRepositoryInputSchema.findMany>,
  ): Promise<Result<DocumentEntity[], Err>>;
  update(
    input: z.infer<typeof documentCrudRepositoryInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof documentCrudRepositoryInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export { type DocumentCrudRepository, documentCrudRepositoryInputSchema };
