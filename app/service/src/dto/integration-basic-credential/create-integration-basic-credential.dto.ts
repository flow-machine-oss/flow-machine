import z from "zod";
import { futureExpiredAtSchema } from "@/dto/shared.dto";

export const createIntegrationBasicCredentialRequestBodySchema = z.object({
  username: z.string().min(1).max(256),
  password: z.string().min(1).max(256),
  expiredAt: futureExpiredAtSchema,
});
