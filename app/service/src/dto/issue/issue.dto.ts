import z from "zod";
import { issueFieldInstanceResponseDtoSchema } from "@/dto/issue/issue-field-instance.dto";
import { issueIntegrationResponseDtoSchema } from "@/dto/issue/issue-integration.dto";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const issueResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  projectId: idSchema.nullable(),
  fieldInstances: z.array(issueFieldInstanceResponseDtoSchema),
  integration: issueIntegrationResponseDtoSchema.nullable(),
});
