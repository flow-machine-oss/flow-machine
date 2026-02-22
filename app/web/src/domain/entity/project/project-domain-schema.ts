import { z } from "zod/v4";
import { tenantAwareBaseDomainSchema } from "@/domain/entity/shared-schema";

export const projectDomainSchema = z.object({
  ...tenantAwareBaseDomainSchema.shape,
  name: z.string(),
});
export type ProjectDomain = z.infer<typeof projectDomainSchema>;
