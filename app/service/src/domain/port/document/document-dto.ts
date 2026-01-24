import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { documentEntityProps } from "@/domain/entity/document/document-entity";

const documentCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createDocumentUseCaseInputSchema = z.object({
  ctx: documentCtxSchema,
  payload: z.object({
    content: documentEntityProps.shape.content,
    projectId: documentEntityProps.shape.projectId,
    title: documentEntityProps.shape.title,
  }),
});

export const getDocumentUseCaseInputSchema = z.object({
  ctx: documentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listDocumentsUseCaseInputSchema = z.object({
  ctx: documentCtxSchema,
});

export const updateDocumentUseCaseInputSchema = z.object({
  ctx: documentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    content: documentEntityProps.shape.content.optional(),
    projectId: documentEntityProps.shape.projectId.optional(),
    title: documentEntityProps.shape.title.optional(),
  }),
});

export const deleteDocumentUseCaseInputSchema = z.object({
  ctx: documentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
