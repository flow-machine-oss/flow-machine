import z from "zod/v4";

export const baseHttpResponseDtoSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const tenantAwareBaseHttpResponseDtoSchema = z.object({
  ...baseHttpResponseDtoSchema.shape,
  tenant: z.object({
    id: z.string(),
    type: z.enum(["organization", "user"]),
  }),
});
