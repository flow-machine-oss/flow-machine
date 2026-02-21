import { z } from "zod/v4";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";

export const editAiAgentFormValuesSchema = z.object({
  name: aiAgentDomainSchema.shape.name,
  model: aiAgentDomainSchema.shape.model,
});

export type EditAiAgentFormValues = z.infer<typeof editAiAgentFormValuesSchema>;
