import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";
import { gitRepositoryProviderIds } from "@/schema/git-repository-integration.schema";

export const gitRepositoryIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  credentialId: idSchema,
  gitRepositoryId: idSchema,
  providerId: z.enum(gitRepositoryProviderIds),
});
