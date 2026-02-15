import { z } from "zod/v4";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";

export const createAiAgentFormValuesSchema = z.object({
  name: aiAgentDomainSchema.shape.name,
  model: aiAgentDomainSchema.shape.model,
});

export type CreateAiAgentFormValues = z.infer<
  typeof createAiAgentFormValuesSchema
>;
