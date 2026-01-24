import z from "zod";
import { organizationAwareBaseResponseDtoSchema } from "@/old/dto/shared.dto";
import { aiAgentModels } from "@/old/schema/ai-agent.schema";

export const aiAgentResponseDtoSchema = z.object({
  ...organizationAwareBaseResponseDtoSchema.shape,
  model: z.enum(aiAgentModels),
  name: z.string(),
});
