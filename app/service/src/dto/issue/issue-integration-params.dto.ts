import z from "zod";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const issueIntegrationParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  integrationId: idSchema,
});
