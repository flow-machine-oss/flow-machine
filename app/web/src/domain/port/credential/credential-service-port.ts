import { z } from "zod/v4";
import { domainIdSchema } from "@/domain/entity/shared-schema";

export const createCredentialServicePortInSchema = z.object({
  body: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("apiKey"),
      apiKey: z.string(),
      expiredAt: z.string(),
    }),
    z.object({
      type: z.literal("basic"),
      username: z.string(),
      password: z.string(),
      expiredAt: z.string(),
    }),
  ]),
});
export type CreateCredentialServicePortIn = z.output<
  typeof createCredentialServicePortInSchema
>;

export const deleteCredentialServicePortInSchema = z.object({
  params: z.object({
    id: domainIdSchema,
  }),
});
export type DeleteCredentialServicePortIn = z.output<
  typeof deleteCredentialServicePortInSchema
>;

export const getCredentialServicePortInSchema = z.object({
  params: z.object({
    id: domainIdSchema,
  }),
});
export type GetCredentialServicePortIn = z.output<
  typeof getCredentialServicePortInSchema
>;

export const updateCredentialServicePortInSchema = z.object({
  params: z.object({
    id: domainIdSchema,
  }),
  body: z.discriminatedUnion("type", [
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
  ]),
});
export type UpdateCredentialServicePortIn = z.output<
  typeof updateCredentialServicePortInSchema
>;
