import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import {
  type DocumentEntity,
  documentEntityProps,
} from "@/core/domain/document/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const documentCrudServiceInputSchema = {
  create: z.object({
    ctx: ctxSchema,
    payload: z.object({
      content: documentEntityProps.shape.content,
      projectId: documentEntityProps.shape.projectId,
      title: documentEntityProps.shape.title,
    }),
  }),

  get: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
    }),
  }),

  list: z.object({
    ctx: ctxSchema,
  }),

  update: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
      content: documentEntityProps.shape.content.optional(),
      projectId: documentEntityProps.shape.projectId.optional(),
      title: documentEntityProps.shape.title.optional(),
    }),
  }),

  delete: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
    }),
  }),
};

interface DocumentCrudService {
  create(
    input: z.infer<typeof documentCrudServiceInputSchema.create>,
  ): Promise<Result<void, Err>>;
  get(
    input: z.infer<typeof documentCrudServiceInputSchema.get>,
  ): Promise<Result<DocumentEntity, Err>>;
  list(
    input: z.infer<typeof documentCrudServiceInputSchema.list>,
  ): Promise<Result<DocumentEntity[], Err>>;
  update(
    input: z.infer<typeof documentCrudServiceInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof documentCrudServiceInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export { type DocumentCrudService, documentCrudServiceInputSchema };
