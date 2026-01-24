import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { idSchema } from "@/old/lib/id";

export const documentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  content: z.string(),
  projectId: idSchema.nullable(),
  title: z.string(),
});
