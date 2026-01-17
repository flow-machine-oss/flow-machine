import z from "zod";
import { idSchema } from "@/lib/id";

export const updateGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema.optional(),
  providerId: z.enum(["gitHub", "gitLab"]).optional(),
});
