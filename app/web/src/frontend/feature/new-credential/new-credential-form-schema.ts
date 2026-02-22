import { z } from "zod/v4";

export const newCredentialFormValuesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    apiKey: z.string().min(1, "API key is required"),
    expiredAt: z.string().min(1, "Expiration date is required"),
  }),
  z.object({
    type: z.literal("basic"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    expiredAt: z.string().min(1, "Expiration date is required"),
  }),
]);

export type NewCredentialFormValues = z.infer<
  typeof newCredentialFormValuesSchema
>;
