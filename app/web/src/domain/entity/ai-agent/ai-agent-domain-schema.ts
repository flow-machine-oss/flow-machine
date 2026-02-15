import { z } from "zod/v4";
import { tenantAwareBaseDomainSchema } from "@/domain/entity/shared-schema";

const aiModels = [
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-opus-4.5",
  "anthropic/claude-sonnet-4.5",
  "minimax/minimax-m2.1",
  "x-ai/grok-code-fast-1",
  "z-ai/glm-4.7",
] as const;

export const aiAgentDomainSchema = z.object({
  ...tenantAwareBaseDomainSchema.shape,
  model: z.enum(aiModels),
  name: z.string(),
});
export type AiAgentDomain = z.infer<typeof aiAgentDomainSchema>;
