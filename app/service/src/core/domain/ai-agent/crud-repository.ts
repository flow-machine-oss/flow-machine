import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import { AiAgentEntity } from "@/core/domain/ai-agent/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const aiAgentCrudRepositoryInputSchema = {
  insert: z.object({
    ctx: ctxSchema,
    data: z.instanceof(AiAgentEntity),
  }),

  findOne: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),

  findMany: z.object({
    ctx: ctxSchema,
  }),

  update: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
    data: z.instanceof(AiAgentEntity),
  }),

  delete: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),
};

interface AiAgentCrudRepository {
  insert(
    input: z.infer<typeof aiAgentCrudRepositoryInputSchema.insert>,
  ): Promise<Result<void, Err>>;
  findOne(
    input: z.infer<typeof aiAgentCrudRepositoryInputSchema.findOne>,
  ): Promise<Result<AiAgentEntity | null, Err>>;
  findMany(
    input: z.infer<typeof aiAgentCrudRepositoryInputSchema.findMany>,
  ): Promise<Result<AiAgentEntity[], Err>>;
  update(
    input: z.infer<typeof aiAgentCrudRepositoryInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof aiAgentCrudRepositoryInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export { type AiAgentCrudRepository, aiAgentCrudRepositoryInputSchema };
