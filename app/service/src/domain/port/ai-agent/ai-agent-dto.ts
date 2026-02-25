import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { aiAgentEntityProps } from "@/domain/entity/ai-agent/ai-agent-entity";

const aiAgentCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createAiAgentUseCaseInputSchema = z.object({
  ctx: aiAgentCtxSchema,
  payload: z.object({
    name: aiAgentEntityProps.shape.name,
    model: aiAgentEntityProps.shape.model,
    projects: aiAgentEntityProps.shape.projects,
  }),
});

export const getAiAgentUseCaseInputSchema = z.object({
  ctx: aiAgentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listAiAgentsUseCaseInputSchema = z.object({
  ctx: aiAgentCtxSchema,
});

export const updateAiAgentUseCaseInputSchema = z.object({
  ctx: aiAgentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    name: aiAgentEntityProps.shape.name.optional(),
    model: aiAgentEntityProps.shape.model.optional(),
    projects: aiAgentEntityProps.shape.projects.optional(),
  }),
});

export const deleteAiAgentUseCaseInputSchema = z.object({
  ctx: aiAgentCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
