import z from "zod";
import { documentCrudServiceInputSchema } from "@/core/domain/document/crud-service";
import { documentEntityProps } from "@/core/domain/document/entity";
import { entityIdSchema } from "@/core/domain/entity";
import { tenantSchema } from "@/core/domain/tenant-aware-entity";

const documentResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  content: documentEntityProps.shape.content,
  projectId: documentEntityProps.shape.projectId,
  title: documentEntityProps.shape.title,
});
type DocumentResponseDto = z.output<typeof documentResponseDtoSchema>;

const postDocumentRequestBodyDtoSchema = z.object({
  content: documentCrudServiceInputSchema.create.shape.payload.shape.content,
  projectId:
    documentCrudServiceInputSchema.create.shape.payload.shape.projectId,
  title: documentCrudServiceInputSchema.create.shape.payload.shape.title,
});

const patchDocumentRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const patchDocumentRequestBodyDtoSchema = z.object({
  content: documentEntityProps.shape.content.optional(),
  projectId: documentEntityProps.shape.projectId.optional(),
  title: documentEntityProps.shape.title.optional(),
});

const deleteDocumentRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export {
  documentResponseDtoSchema,
  type DocumentResponseDto,
  postDocumentRequestBodyDtoSchema,
  patchDocumentRequestParamsDtoSchema,
  patchDocumentRequestBodyDtoSchema,
  deleteDocumentRequestParamsDtoSchema,
};
