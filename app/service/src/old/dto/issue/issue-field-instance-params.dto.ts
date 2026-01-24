import z from "zod";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const issueFieldInstanceParamsSchema = z.object({
  ...idRequestParamsDtoSchema.shape,
  fieldInstanceId: idSchema,
});
