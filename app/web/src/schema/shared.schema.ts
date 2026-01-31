import { z } from "zod/v4";

export const idDtoSchema = z.string();

export const stringToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});

export const baseDtoSchema = z.object({
  id: z.string(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export const organizationAwareBaseDtoSchema = z.object({
  ...baseDtoSchema.shape,
  organizationId: z.string(),
});

// Tenant schema matching service's tenant-aware-entity.ts
export const tenantTypes = ["organization", "user"] as const;

export const tenantSchema = z.object({
  id: z.string(),
  type: z.enum(tenantTypes),
});
export type Tenant = z.output<typeof tenantSchema>;

// Tenant-aware base DTO schema
export const tenantAwareBaseDtoSchema = z.object({
  ...baseDtoSchema.shape,
  tenant: tenantSchema,
});

export const idParamsDtoSchema = z.object({
  id: idDtoSchema,
});
export type IdParamsDto = z.output<typeof idParamsDtoSchema>;
