import z from "zod";
import { idSchema } from "@/lib/id";

export const baseResponseDtoSchema = z.object({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const organizationAwareBaseResponseDtoSchema = z.object({
  ...baseResponseDtoSchema.shape,
  organizationId: z.string(),
});

export const idRequestParamsDtoSchema = z.object({
  id: idSchema,
});
