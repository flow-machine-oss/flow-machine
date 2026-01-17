import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const updateIssueIntegrationRequestBodySchema = z.object({
  externalId: idSchema.optional(),
  externalKey: z.string().max(32).optional(),
  providerId: z.enum(projectIntegrationProviderIds).optional(),
});
