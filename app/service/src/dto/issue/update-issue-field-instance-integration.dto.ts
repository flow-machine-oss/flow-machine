import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const updateIssueFieldInstanceIntegrationRequestBodySchema = z.object({
  externalId: idSchema.optional(),
  providerId: z.enum(projectIntegrationProviderIds).optional(),
});
