import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";

export const integrationApiKeyCredentialResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  apiKey: z.string(),
  expiredAt: z.date(),
});
