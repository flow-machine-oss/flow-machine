import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  AiAgentEntity,
  aiAgentEntityProps,
} from "@/domain/entity/ai-agent/ai-agent-entity";

const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertAiAgentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      data: z.instanceof(AiAgentEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertAiAgentRepository = z.output<
  typeof insertAiAgentRepositorySchema
>;

export const findAiAgentByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.instanceof(AiAgentEntity).nullable(), z.instanceof(Err)),
  ),
});
export type FindAiAgentByIdRepository = z.output<
  typeof findAiAgentByIdRepositorySchema
>;

export const findAiAgentsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(AiAgentEntity)), z.instanceof(Err)),
  ),
});
export type FindAiAgentsRepository = z.output<
  typeof findAiAgentsRepositorySchema
>;

export const updateAiAgentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        name: aiAgentEntityProps.shape.name.optional(),
        model: aiAgentEntityProps.shape.model.optional(),
        projects: aiAgentEntityProps.shape.projects.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateAiAgentRepository = z.output<
  typeof updateAiAgentRepositorySchema
>;

export const deleteAiAgentRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteAiAgentRepository = z.output<
  typeof deleteAiAgentRepositorySchema
>;
