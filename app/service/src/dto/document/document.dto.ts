import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const documentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  title: z.string(),
  content: z.string(),
});
