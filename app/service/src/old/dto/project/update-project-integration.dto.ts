import z from "zod";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const updateProjectIntegrationRequestBodySchema = z.object({
  credentialId: idSchema.optional(),
  externalId: z.string().min(1).max(64).optional(),
  providerId: z.enum(projectIntegrationProviderIds).optional(),
});
