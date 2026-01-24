import z from "zod";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const createProjectIntegrationRequestBodySchema = z.object({
  credentialId: idSchema,
  externalId: z.string().min(1).max(64),
  providerId: z.enum(projectIntegrationProviderIds),
  webhookSecret: z.string().min(1).max(64),
});
