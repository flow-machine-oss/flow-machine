import { z } from "zod/v4";
import { gitRepositoryDomainSchema } from "@/domain/entity/git-repository/git-repository-domain-schema";

export const newGitRepositoryFormValuesSchema = z.object({
  name: gitRepositoryDomainSchema.shape.name,
  url: gitRepositoryDomainSchema.shape.url,
  config: gitRepositoryDomainSchema.shape.config,
  integration: gitRepositoryDomainSchema.shape.integration,
});

export type NewGitRepositoryFormValues = z.infer<
  typeof newGitRepositoryFormValuesSchema
>;
