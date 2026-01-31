import { z } from "zod/v4";
import { organizationAwareBaseDtoSchema } from "@/schema/shared.schema";

export const aiModels = [
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-opus-4.5",
  "anthropic/claude-sonnet-4.5",
  "minimax/minimax-m2.1",
  "x-ai/grok-code-fast-1",
  "z-ai/glm-4.7",
] as const;

export const aiAgentResponseDtoSchema = z.object({
  ...organizationAwareBaseDtoSchema.shape,
  model: z.enum(aiModels),
  name: z.string(),
});

export type AiAgentResponseDto = z.output<typeof aiAgentResponseDtoSchema>;
