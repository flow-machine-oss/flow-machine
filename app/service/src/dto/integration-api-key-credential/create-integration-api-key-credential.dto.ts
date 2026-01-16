import z from "zod";
import { futureExpiredAtSchema } from "@/dto/shared.dto";

export const createIntegrationApiKeyCredentialRequestBodySchema = z.object({
  apiKey: z.string().min(1).max(256),
  expiredAt: futureExpiredAtSchema,
});
