import z from "zod";

export const baseResponseDtoSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const organizationAwareBaseResponseDtoSchema = z.object({
  ...baseResponseDtoSchema.shape,
  organizationId: z.string(),
});
