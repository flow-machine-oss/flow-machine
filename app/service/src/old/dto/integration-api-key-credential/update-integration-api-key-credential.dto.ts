import z from "zod";
import { futureExpiredAtSchema } from "@/old/dto/shared.dto";

export const updateIntegrationApiKeyCredentialRequestBodySchema = z.object({
  apiKey: z.string().min(1).max(256).optional(),
  expiredAt: futureExpiredAtSchema,
});
