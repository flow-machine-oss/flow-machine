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

export const idParamsDtoSchema = z.object({
  id: idDtoSchema,
});
export type IdParamsDto = z.output<typeof idParamsDtoSchema>;
