import { z } from "zod/v4";

export const editCredentialFormValuesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    apiKey: z.string().optional(),
    expiredAt: z.string().optional(),
  }),
  z.object({
    type: z.literal("basic"),
    username: z.string().optional(),
    password: z.string().optional(),
    expiredAt: z.string().optional(),
  }),
]);

export type EditCredentialFormValues = z.infer<
  typeof editCredentialFormValuesSchema
>;
