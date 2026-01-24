import z from "zod";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const gitRepositoryIntegrationParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  integrationId: idSchema,
});
