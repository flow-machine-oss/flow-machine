import z from "zod";
import { issueFieldInstanceParamsSchema } from "@/old/dto/issue/issue-field-instance-params.dto";
import { idSchema } from "@/old/lib/id";

export const issueFieldInstanceIntegrationParamsSchema = z.object({
  ...issueFieldInstanceParamsSchema.shape,
  integrationId: idSchema,
});
