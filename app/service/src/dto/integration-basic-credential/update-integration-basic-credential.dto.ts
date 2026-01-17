import z from "zod";
import { futureExpiredAtSchema } from "@/dto/shared.dto";

export const updateIntegrationBasicCredentialRequestBodySchema = z.object({
  username: z.string().min(1).max(256).optional(),
  password: z.string().min(1).max(256).optional(),
  expiredAt: futureExpiredAtSchema.optional(),
});
