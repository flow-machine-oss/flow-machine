import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";

export const integrationApiKeyCredentialResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  apiKey: z.string(),
  expiredAt: z.date(),
});
