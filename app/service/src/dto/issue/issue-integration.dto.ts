import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";

export const issueIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: idSchema,
  externalKey: z.string(),
  issueId: idSchema,
  providerId: z.enum(projectIntegrationProviderIds),
});
