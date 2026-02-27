import z from "zod";
import { aiAgentCrudServiceInputSchema } from "@/core/domain/ai-agent/crud-service";
import { aiAgentEntityProps } from "@/core/domain/ai-agent/entity";
import { entityIdSchema } from "@/core/domain/entity";
import { tenantSchema } from "@/core/domain/tenant-aware-entity";

const aiAgentResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  name: aiAgentEntityProps.shape.name,
  model: aiAgentEntityProps.shape.model,
  projects: aiAgentEntityProps.shape.projects,
});
type AiAgentResponseDto = z.output<typeof aiAgentResponseDtoSchema>;

const postAiAgentRequestBodyDtoSchema = z.object({
  name: aiAgentCrudServiceInputSchema.create.shape.payload.shape.name,
  model: aiAgentCrudServiceInputSchema.create.shape.payload.shape.model,
  projects:
    aiAgentCrudServiceInputSchema.create.shape.payload.shape.projects.default(
      [],
    ),
});

const patchAiAgentRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const patchAiAgentRequestBodyDtoSchema = z.object({
  name: aiAgentEntityProps.shape.name.optional(),
  model: aiAgentEntityProps.shape.model.optional(),
  projects: aiAgentEntityProps.shape.projects.optional(),
});

const deleteAiAgentRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export {
  aiAgentResponseDtoSchema,
  type AiAgentResponseDto,
  postAiAgentRequestBodyDtoSchema,
  patchAiAgentRequestParamsDtoSchema,
  patchAiAgentRequestBodyDtoSchema,
  deleteAiAgentRequestParamsDtoSchema,
};
