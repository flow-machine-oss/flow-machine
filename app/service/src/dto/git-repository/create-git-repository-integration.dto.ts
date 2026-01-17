import z from "zod";
import { idSchema } from "@/lib/id";
import { gitRepositoryProviderIds } from "@/schema/git-repository-integration.schema";

export const createGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema,
  providerId: z.enum(gitRepositoryProviderIds),
});
