import z from "zod";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const createIssueFieldInstanceIntegrationRequestBodySchema = z.object({
  externalId: idSchema,
  providerId: z.enum(projectIntegrationProviderIds),
});
