import z from "zod";
import { idSchema } from "@/lib/id";

export const createGitRepositoryIntegrationRequestBodySchema = z.object({
  credentialId: idSchema,
  providerId: z.enum(["gitHub", "gitLab"]),
});
