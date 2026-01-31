import { z } from "zod/v4";
import { aiModels } from "@/schema/ai-agent/ai-agent-service-schema";

export const createAiAgentRequestBodyDtoSchema = z.object({
  model: z.enum(aiModels),
  name: z.string().min(1).max(256),
});

export type CreateAiAgentRequestBodyDto = z.output<
  typeof createAiAgentRequestBodyDtoSchema
>;
