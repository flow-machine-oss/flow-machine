import { z } from "zod/v4";

export const domainIdSchema = z.uuidv7();

export const baseDomainSchema = z.object({
  id: domainIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const tenantAwareBaseDomainSchema = baseDomainSchema.extend({
  ...baseDomainSchema.shape,
  tenant: z.object({
    id: domainIdSchema,
    type: z.enum(["organization", "user"]),
  }),
});
