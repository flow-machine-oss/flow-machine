import z from "zod";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const projectIntegrationParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  integrationId: idSchema,
});
