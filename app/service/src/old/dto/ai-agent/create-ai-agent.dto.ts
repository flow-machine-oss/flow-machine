import z from "zod";
import { aiAgentModels } from "@/old/schema/ai-agent.schema";

export const createAiAgentRequestBodySchema = z.object({
  model: z.enum(aiAgentModels),
  name: z.string().min(1).max(256),
});
