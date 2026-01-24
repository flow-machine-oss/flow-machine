import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";

export const issueFieldInstanceIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: idSchema,
  issueFieldInstanceId: idSchema,
  providerId: z.enum(projectIntegrationProviderIds),
});
