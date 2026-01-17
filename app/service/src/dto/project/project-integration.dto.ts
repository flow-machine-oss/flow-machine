import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const projectIntegrationResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  externalId: z.string(),
  externalKey: z.string(),
  providerId: z.enum(["jira", "linear"]),
  credentialId: z.string(),
  projectId: z.string(),
});
