import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { idSchema } from "@/lib/id";

export const documentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  content: z.string(),
  projectId: idSchema.nullable(),
  title: z.string(),
});
