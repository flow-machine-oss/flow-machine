import z from "zod";
import { projectIntegrationResponseDtoSchema } from "@/dto/project/project-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const projectResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  name: z.string(),
  key: z.string(),
  integration: projectIntegrationResponseDtoSchema.nullable(),
});
