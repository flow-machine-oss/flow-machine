import { z } from "zod/v4";
import { tenantAwareBaseDtoSchema } from "@/schema/shared.schema";

export const gitProviders = ["github", "gitlab"] as const;

export const gitRepositoryConfigSchema = z.object({
  defaultBranch: z.string(),
  email: z.string(),
  username: z.string(),
});

export const gitRepositoryIntegrationSchema = z.object({
  provider: z.enum(gitProviders),
  credentialId: z.string(),
});

export const gitRepositoryResponseDtoSchema = z.object({
  ...tenantAwareBaseDtoSchema.shape,
  name: z.string(),
  url: z.string(),
  config: gitRepositoryConfigSchema,
  integration: gitRepositoryIntegrationSchema,
});

export type GitRepositoryResponseDto = z.output<
  typeof gitRepositoryResponseDtoSchema
>;
export type GitRepositoryConfig = z.output<typeof gitRepositoryConfigSchema>;
export type GitRepositoryIntegration = z.output<typeof gitRepositoryIntegrationSchema>;
export type GitProvider = (typeof gitProviders)[number];
