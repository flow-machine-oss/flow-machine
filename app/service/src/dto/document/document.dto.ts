import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const documentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  content: z.string(),
  projectId: z.string().nullable(),
  title: z.string(),
});
