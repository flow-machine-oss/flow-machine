import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { documentCrudServiceInputSchema } from "@/v2/core/domain/document/crud-service";
import { documentEntityProps } from "@/v2/core/domain/document/entity";

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
