import z from "zod";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const createIssueIntegrationRequestBodySchema = z.object({
  externalId: idSchema,
  externalKey: z.string().max(32),
  providerId: z.enum(projectIntegrationProviderIds),
});
