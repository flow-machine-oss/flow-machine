import type { Result } from "neverthrow";
import z from "zod";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { AiAgentEntity } from "@/core/domain/ai-agent/entity";
import { CredentialEntity } from "@/core/domain/credential/entity";
import { GitRepositoryEntity } from "@/core/domain/git-repository/entity";
import { ProjectEntity } from "@/core/domain/project/entity";
import { WorkflowDefinitionEntity } from "@/core/domain/workflow/definition/entity";

const externalProjectServiceInputSchema = {
  syncAiAgentIssueField: z.object({
    ctx: tenantCtxSchema,
    credential: z.instanceof(CredentialEntity),
    project: z.instanceof(ProjectEntity),
    aiAgent: z.instanceof(AiAgentEntity),
  }),
  syncGitRepositoryIssueField: z.object({
    ctx: tenantCtxSchema,
    credential: z.instanceof(CredentialEntity),
    project: z.instanceof(ProjectEntity),
    gitRepository: z.instanceof(GitRepositoryEntity),
  }),
  syncWorkflowDefinitionIssueField: z.object({
    ctx: tenantCtxSchema,
    credential: z.instanceof(CredentialEntity),
    project: z.instanceof(ProjectEntity),
    workflowDefinition: z.instanceof(WorkflowDefinitionEntity),
  }),
};

interface ExternalProjectService {
  syncAiAgentIssueField(
    input: z.infer<
      typeof externalProjectServiceInputSchema.syncAiAgentIssueField
    >,
  ): Promise<Result<void, Error>>;
  syncGitRepositoryIssueField(
    input: z.infer<
      typeof externalProjectServiceInputSchema.syncGitRepositoryIssueField
    >,
  ): Promise<Result<void, Error>>;
  syncWorkflowDefinitionIssueField(
    input: z.infer<
      typeof externalProjectServiceInputSchema.syncWorkflowDefinitionIssueField
    >,
  ): Promise<Result<void, Error>>;
}

export { type ExternalProjectService, externalProjectServiceInputSchema };
