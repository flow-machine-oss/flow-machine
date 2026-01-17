import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const gitRepositoryIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  credentialId: idSchema,
  gitRepositoryId: idSchema,
  providerId: z.enum(["gitHub", "gitLab"]),
});
