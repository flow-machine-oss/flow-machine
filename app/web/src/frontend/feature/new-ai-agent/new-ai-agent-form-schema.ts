import { z } from "zod/v4";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";

export const newAiAgentFormValuesSchema = z.object({
  name: aiAgentDomainSchema.shape.name,
  model: aiAgentDomainSchema.shape.model,
});

export type NewAiAgentFormValues = z.infer<typeof newAiAgentFormValuesSchema>;
