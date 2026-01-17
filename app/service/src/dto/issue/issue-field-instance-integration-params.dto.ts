import z from "zod";
import { issueFieldInstanceParamsSchema } from "@/dto/issue/issue-field-instance-params.dto";
import { idSchema } from "@/lib/id";

export const issueFieldInstanceIntegrationParamsSchema = z.object({
  ...issueFieldInstanceParamsSchema.shape,
  integrationId: idSchema,
});
