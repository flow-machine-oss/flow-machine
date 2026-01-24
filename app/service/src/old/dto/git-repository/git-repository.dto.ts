import z from "zod";
import { gitRepositoryIntegrationResponseDtoSchema } from "@/old/dto/git-repository/git-repository-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";

export const gitRepositoryResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  contributorEmail: z.string(),
  contributorName: z.string(),
  integration: gitRepositoryIntegrationResponseDtoSchema.nullable(),
  name: z.string(),
  url: z.string(),
});
