import z from "zod";
import {
  apiKeySchema,
  futureDateSchema,
} from "@/dto/integration-api-key-credential/create-integration-api-key-credential.dto";

export const updateIntegrationApiKeyCredentialRequestBodySchema = z.object({
  apiKey: apiKeySchema.optional(),
  expiredAt: futureDateSchema.optional(),
});
