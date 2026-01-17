import z from "zod";
import { idSchema } from "@/lib/id";
import { gitRepositoryProviderIds } from "@/schema/git-repository-integration.schema";

export const updateGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema.optional(),
  providerId: z.enum(gitRepositoryProviderIds).optional(),
});
