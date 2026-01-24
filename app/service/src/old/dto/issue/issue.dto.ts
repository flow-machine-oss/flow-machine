import z from "zod";
import { issueFieldInstanceResponseDtoSchema } from "@/old/dto/issue/issue-field-instance.dto";
import { issueIntegrationResponseDtoSchema } from "@/old/dto/issue/issue-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const issueResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  projectId: idSchema.nullable(),
  fieldInstances: z.array(issueFieldInstanceResponseDtoSchema),
  integration: issueIntegrationResponseDtoSchema.nullable(),
});
