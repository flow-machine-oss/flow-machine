import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const createIssueIntegrationRequestBodySchema = z.object({
  externalId: idSchema,
  externalKey: z.string().max(32),
  providerId: z.enum(projectIntegrationProviderIds),
});
