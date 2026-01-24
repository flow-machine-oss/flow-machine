import z from "zod";
import { idSchema } from "@/old/lib/id";
import { gitRepositoryProviderIds } from "@/old/schema/git-repository-integration.schema";

export const updateGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema.optional(),
  providerId: z.enum(gitRepositoryProviderIds).optional(),
});
