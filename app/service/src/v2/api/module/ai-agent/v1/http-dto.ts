import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { aiAgentCrudServiceInputSchema } from "@/v2/core/domain/ai-agent/crud-service";
import { aiAgentEntityProps } from "@/v2/core/domain/ai-agent/entity";

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
