import z from "zod";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const issueFieldInstanceParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  fieldInstanceId: idSchema,
});
