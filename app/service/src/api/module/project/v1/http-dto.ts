import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { projectCrudServiceInputSchema } from "@/core/domain/project/crud-service";
import { projectEntityProps } from "@/core/domain/project/entity";

const projectResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: projectEntityProps.shape.name,
});
type ProjectResponseDto = z.output<typeof projectResponseDtoSchema>;

const postProjectRequestBodyDtoSchema = z.object({
  name: projectCrudServiceInputSchema.create.shape.payload.shape.name,
});

const patchProjectRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const patchProjectRequestBodyDtoSchema = z.object({
  name: projectEntityProps.shape.name.optional(),
});

const deleteProjectRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export {
  projectResponseDtoSchema,
  type ProjectResponseDto,
  postProjectRequestBodyDtoSchema,
  patchProjectRequestParamsDtoSchema,
  patchProjectRequestBodyDtoSchema,
  deleteProjectRequestParamsDtoSchema,
};
