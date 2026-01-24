import z from "zod";
import { issueFieldInstanceIntegrationResponseDtoSchema } from "@/old/dto/issue/issue-field-instance-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const issueFieldInstanceResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  issueFieldDefinitionId: idSchema,
  issueId: idSchema,
  value: z.string().nullable(),
  integration: issueFieldInstanceIntegrationResponseDtoSchema.nullable(),
});
