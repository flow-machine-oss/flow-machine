import z from "zod";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const createProjectIntegrationRequestBodySchema = z.object({
  credentialId: idSchema,
  externalId: z.string().min(1).max(32),
  externalKey: z.string().min(1).max(32),
  providerId: z.enum(projectIntegrationProviderIds),
  webhookSecret: z.string().min(1).max(32),
});
