import z from "zod";
import { idSchema } from "@/old/lib/id";

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

export const futureExpiredAtSchema = z.coerce
  .date()
  .refine((date) => date > new Date(), {
    message: "expiredAt must be a future date",
  });
