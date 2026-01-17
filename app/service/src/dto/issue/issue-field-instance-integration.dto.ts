import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const issueFieldInstanceIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: idSchema,
  issueFieldInstanceId: idSchema,
  providerId: z.enum(projectIntegrationProviderIds),
});
