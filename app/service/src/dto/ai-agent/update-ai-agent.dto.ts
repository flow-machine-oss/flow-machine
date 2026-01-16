import z from "zod";
import { aiAgentModels } from "@/schema/ai-agent.schema";

export const updateAiAgentRequestBodySchema = z.object({
  model: z.enum(aiAgentModels).optional(),
  name: z.string().min(1).max(256).optional(),
});
