import { z } from "zod/v4";
import {
  datetimeSchema,
  tenantAwareBaseDomainSchema,
} from "@/domain/entity/shared-schema";

export const credentialTypes = ["apiKey", "basic"] as const;

export const credentialDomainSchema = z.discriminatedUnion("type", [
  z.object({
    ...tenantAwareBaseDomainSchema.shape,
    type: z.literal("apiKey"),
    apiKey: z.string(),
    expiredAt: datetimeSchema,
  }),
  z.object({
    ...tenantAwareBaseDomainSchema.shape,
    type: z.literal("basic"),
    username: z.string(),
    password: z.string(),
    expiredAt: datetimeSchema,
  }),
]);
export type CredentialDomain = z.infer<typeof credentialDomainSchema>;
