import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  DocumentEntity,
  documentEntityProps,
} from "@/domain/entity/document/document-entity";

const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertDocumentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      data: z.instanceof(DocumentEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertDocumentRepository = z.output<
  typeof insertDocumentRepositorySchema
>;

export const findDocumentByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(DocumentEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindDocumentByIdRepository = z.output<
  typeof findDocumentByIdRepositorySchema
>;

export const findDocumentsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(DocumentEntity)), z.instanceof(Err)),
  ),
});
export type FindDocumentsRepository = z.output<
  typeof findDocumentsRepositorySchema
>;

export const updateDocumentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        content: documentEntityProps.shape.content.optional(),
        projectId: documentEntityProps.shape.projectId.optional(),
        title: documentEntityProps.shape.title.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateDocumentRepository = z.output<
  typeof updateDocumentRepositorySchema
>;

export const deleteDocumentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});

export type DeleteDocumentRepository = z.output<
  typeof deleteDocumentRepositorySchema
>;
