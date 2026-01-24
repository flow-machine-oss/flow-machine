import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { documentEntityProps } from "@/domain/entity/document/document-entity";
import { createDocumentUseCaseInputSchema } from "@/domain/port/document/document-dto";

export const postDocumentRequestBodyDtoSchema = z.object({
  content: createDocumentUseCaseInputSchema.shape.payload.shape.content,
  projectId: createDocumentUseCaseInputSchema.shape.payload.shape.projectId,
  title: createDocumentUseCaseInputSchema.shape.payload.shape.title,
});

export const patchDocumentRequestBodyDtoSchema = z.object({
  content: documentEntityProps.shape.content.optional(),
  projectId: documentEntityProps.shape.projectId.optional(),
  title: documentEntityProps.shape.title.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const documentResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.string(),
  content: documentEntityProps.shape.content,
  projectId: documentEntityProps.shape.projectId,
  title: documentEntityProps.shape.title,
});

export type DocumentResponseDto = z.output<typeof documentResponseDtoSchema>;
