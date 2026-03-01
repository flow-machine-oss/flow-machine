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
  syncAiAgentsToExternal: z.object({
    ctx: ctxSchema,
    projectId: entityIdSchema,
  }),
  syncGitRepositoriesToExternal: z.object({
    ctx: ctxSchema,
    projectId: entityIdSchema,
  }),
  syncWorkflowDefinitionsToExternal: z.object({
    ctx: ctxSchema,
    projectId: entityIdSchema,
  }),
};

interface ProjectSyncService {
  syncAiAgentsToExternal(
    input: z.infer<typeof projectSyncServiceInputSchema.syncAiAgentsToExternal>,
  ): Promise<Result<void, Err>>;
  syncGitRepositoriesToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncGitRepositoriesToExternal
    >,
  ): Promise<Result<void, Err>>;
  syncWorkflowDefinitionsToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncWorkflowDefinitionsToExternal
    >,
  ): Promise<Result<void, Err>>;
}

export { type ProjectSyncService, projectSyncServiceInputSchema };
