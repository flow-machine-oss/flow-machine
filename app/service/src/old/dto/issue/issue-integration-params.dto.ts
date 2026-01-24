import z from "zod";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const issueIntegrationParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  integrationId: idSchema,
});
