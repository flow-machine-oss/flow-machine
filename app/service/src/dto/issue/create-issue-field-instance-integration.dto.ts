import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const createIssueFieldInstanceIntegrationRequestBodySchema = z.object({
  externalId: idSchema,
  providerId: z.enum(projectIntegrationProviderIds),
});
