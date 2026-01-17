import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const projectIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: z.string(),
  externalKey: z.string(),
  providerId: z.enum(projectIntegrationProviderIds),
  credentialId: idSchema,
  projectId: idSchema,
});
