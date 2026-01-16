import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const integrationBasicCredentialResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  username: z.string(),
  password: z.undefined().optional(),
  expiredAt: z.date(),
});
