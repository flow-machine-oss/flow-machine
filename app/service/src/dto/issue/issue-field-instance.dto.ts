import z from "zod";
import { issueFieldInstanceIntegrationResponseDtoSchema } from "@/dto/issue/issue-field-instance-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const issueFieldInstanceResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  issueFieldDefinitionId: idSchema,
  issueId: idSchema,
  value: z.string().nullable(),
  integration: issueFieldInstanceIntegrationResponseDtoSchema.nullable(),
});
