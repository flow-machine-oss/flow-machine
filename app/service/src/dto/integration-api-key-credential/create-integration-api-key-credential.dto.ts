import z from "zod";

export const apiKeySchema = z.string().min(32).max(256);

export const futureDateSchema = z.coerce.date().refine((date) => date > new Date(), {
  message: "expiredAt must be a future date",
});

export const createIntegrationApiKeyCredentialRequestBodySchema = z.object({
  apiKey: apiKeySchema,
  expiredAt: futureDateSchema,
});
