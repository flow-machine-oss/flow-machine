import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const projectIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: z.string(),
  providerId: z.enum(projectIntegrationProviderIds),
  credentialId: idSchema,
  projectId: idSchema,
});
