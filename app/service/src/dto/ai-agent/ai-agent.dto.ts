import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/dto/shared.dto";
import { aiAgentModels } from "@/schema/ai-agent.schema";

export const aiAgentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  model: z.enum(aiAgentModels),
  name: z.string(),
});
