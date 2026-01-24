import z from "zod";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const updateIssueFieldInstanceIntegrationRequestBodySchema = z.object({
  externalId: idSchema.optional(),
  providerId: z.enum(projectIntegrationProviderIds).optional(),
});
