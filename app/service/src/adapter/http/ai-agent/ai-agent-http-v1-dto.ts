import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { aiAgentEntityProps } from "@/domain/entity/ai-agent/ai-agent-entity";
import { createAiAgentUseCaseInputSchema } from "@/domain/port/ai-agent/ai-agent-dto";

export const postAiAgentRequestBodyDtoSchema = z.object({
  name: createAiAgentUseCaseInputSchema.shape.payload.shape.name,
  model: createAiAgentUseCaseInputSchema.shape.payload.shape.model,
  projects: createAiAgentUseCaseInputSchema.shape.payload.shape.projects,
});

export const patchAiAgentRequestBodyDtoSchema = z.object({
  name: aiAgentEntityProps.shape.name.optional(),
  model: aiAgentEntityProps.shape.model.optional(),
  projects: aiAgentEntityProps.shape.projects.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const aiAgentResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: aiAgentEntityProps.shape.name,
  model: aiAgentEntityProps.shape.model,
  projects: aiAgentEntityProps.shape.projects,
});

export type AiAgentResponseDto = z.output<typeof aiAgentResponseDtoSchema>;
