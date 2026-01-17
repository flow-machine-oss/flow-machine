import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const updateProjectIntegrationRequestBodySchema = z.object({
  credentialId: idSchema.optional(),
  externalId: z.string().min(1).max(32).optional(),
  externalKey: z.string().min(1).max(32).optional(),
  providerId: z.enum(projectIntegrationProviderIds).optional(),
});
