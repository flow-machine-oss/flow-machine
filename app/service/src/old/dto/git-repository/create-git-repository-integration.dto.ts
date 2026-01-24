import z from "zod";
import { idSchema } from "@/old/lib/id";
import { gitRepositoryProviderIds } from "@/old/schema/git-repository-integration.schema";

export const createGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema,
  providerId: z.enum(gitRepositoryProviderIds),
});
