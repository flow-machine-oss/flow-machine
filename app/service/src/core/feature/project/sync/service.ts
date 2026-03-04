import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import type { Err } from "@/common/err/err";
import { entityIdSchema } from "@/core/domain/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const projectSyncServiceInputSchema = {
  syncAiAgents: z.object({
    ctx: ctxSchema,
    payload: z.object({
      projectId: entityIdSchema,
    }),
  }),
  syncGitRepositories: z.object({
    ctx: ctxSchema,
    payload: z.object({
      projectId: entityIdSchema,
    }),
  }),
  syncWorkflowDefinitions: z.object({
    ctx: ctxSchema,
    payload: z.object({
      projectId: entityIdSchema,
    }),
  }),
};

interface ProjectSyncService {
  syncAiAgents(
    input: z.infer<typeof projectSyncServiceInputSchema.syncAiAgents>,
  ): Promise<Result<void, Err>>;
  syncGitRepositories(
    input: z.infer<typeof projectSyncServiceInputSchema.syncGitRepositories>,
  ): Promise<Result<void, Err>>;
  syncWorkflowDefinitions(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncWorkflowDefinitions
    >,
  ): Promise<Result<void, Err>>;
}

export { type ProjectSyncService, projectSyncServiceInputSchema };
