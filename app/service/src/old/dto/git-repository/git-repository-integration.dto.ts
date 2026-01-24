import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";
import { gitRepositoryProviderIds } from "@/old/schema/git-repository-integration.schema";

export const gitRepositoryIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  credentialId: idSchema,
  gitRepositoryId: idSchema,
  providerId: z.enum(gitRepositoryProviderIds),
});
