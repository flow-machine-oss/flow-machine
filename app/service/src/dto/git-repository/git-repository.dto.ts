import z from "zod";
import { gitRepositoryIntegrationResponseDtoSchema } from "@/dto/git-repository/git-repository-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const gitRepositoryResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  contributorEmail: z.string(),
  contributorName: z.string(),
  gitRepositoryIntegrations: z
    .array(gitRepositoryIntegrationResponseDtoSchema)
    .optional(),
  name: z.string(),
  url: z.string(),
});
