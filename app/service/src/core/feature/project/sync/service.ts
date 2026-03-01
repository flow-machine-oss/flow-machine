import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
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
  ): Promise<void>;
  syncGitRepositoriesToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncGitRepositoriesToExternal
    >,
  ): Promise<void>;
  syncWorkflowDefinitionsToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncWorkflowDefinitionsToExternal
    >,
  ): Promise<void>;
}

export { type ProjectSyncService, projectSyncServiceInputSchema };
