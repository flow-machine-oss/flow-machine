import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { projectEntityProps } from "@/domain/entity/project/project-entity";
import { createProjectUseCaseInputSchema } from "@/domain/port/project/project-dto";

export const postProjectRequestBodyDtoSchema = z.object({
  name: createProjectUseCaseInputSchema.shape.payload.shape.name,
});

export const patchProjectRequestBodyDtoSchema = z.object({
  name: projectEntityProps.shape.name.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const projectResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: projectEntityProps.shape.name,
});

export type ProjectResponseDto = z.output<typeof projectResponseDtoSchema>;
