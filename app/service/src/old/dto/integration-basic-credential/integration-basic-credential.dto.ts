import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";

export const integrationBasicCredentialResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  username: z.string(),
  password: z.undefined().optional(),
  expiredAt: z.date(),
});
