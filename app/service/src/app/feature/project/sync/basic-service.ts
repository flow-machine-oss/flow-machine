import { isNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { Result } from "neverthrow";
import type z from "zod";
import { Err } from "@/common/err/err";
import type { AiAgentCrudRepository } from "@/core/domain/ai-agent/crud-repository";
import type { CredentialCrudRepository } from "@/core/domain/credential/crud-repository";
import type { CredentialEntity } from "@/core/domain/credential/entity";
import type { GitRepositoryCrudRepository } from "@/core/domain/git-repository/crud-repository";
import type { ProjectCrudRepository } from "@/core/domain/project/crud-repository";
import type { ProjectEntity } from "@/core/domain/project/entity";
import type { WorkflowDefinitionCrudRepository } from "@/core/domain/workflow/definition/crud-repository";
import type {
  ProjectSyncService,
  projectSyncServiceInputSchema,
} from "@/core/feature/project/sync/service";
import type { ExternalProjectService } from "@/core/infra/external/project/service";

export class ProjectSyncBasicService implements ProjectSyncService {
  #projectCrudRepository: ProjectCrudRepository;
  #credentialCrudRepository: CredentialCrudRepository;
  #aiAgentCrudRepository: AiAgentCrudRepository;
  #gitRepositoryCrudRepository: GitRepositoryCrudRepository;
  #workflowDefinitionCrudRepository: WorkflowDefinitionCrudRepository;
  #externalProjectService: ExternalProjectService;

  constructor(
    projectCrudRepository: ProjectCrudRepository,
    credentialCrudRepository: CredentialCrudRepository,
    aiAgentCrudRepository: AiAgentCrudRepository,
    gitRepositoryCrudRepository: GitRepositoryCrudRepository,
    workflowDefinitionCrudRepository: WorkflowDefinitionCrudRepository,
    externalProjectService: ExternalProjectService,
  ) {
    this.#projectCrudRepository = projectCrudRepository;
    this.#credentialCrudRepository = credentialCrudRepository;
    this.#aiAgentCrudRepository = aiAgentCrudRepository;
    this.#gitRepositoryCrudRepository = gitRepositoryCrudRepository;
    this.#workflowDefinitionCrudRepository = workflowDefinitionCrudRepository;
    this.#externalProjectService = externalProjectService;
  }

  async syncAiAgentsToExternal(
    input: z.infer<typeof projectSyncServiceInputSchema.syncAiAgentsToExternal>,
  ): Promise<Result<void, Err>> {
    const { ctx, projectId } = input;

    const resolveResult = await this.#resolveProjectAndCredential(
      ctx,
      projectId,
    );

    if (resolveResult.isErr()) {
      return err(resolveResult.error);
    }
    const { project, credential } = resolveResult.value;

    const findManyResult = await this.#aiAgentCrudRepository.findMany({
      ctx,
      filter: { projectId },
    });

    if (findManyResult.isErr()) {
      return err(findManyResult.error);
    }
    for (const aiAgent of findManyResult.value) {
      aiAgent.markProjectForSync({ projectId });

      await this.#aiAgentCrudRepository.update({
        ctx,
        id: aiAgent.id,
        data: aiAgent,
      });

      const syncResult =
        await this.#externalProjectService.syncAiAgentIssueField({
          ctx,
          credential,
          project,
          aiAgent,
        });

      if (syncResult.isOk()) {
        aiAgent.markProjectAsSynced({ projectId });
      } else {
        aiAgent.markProjectSyncError({ projectId });
      }

      await this.#aiAgentCrudRepository.update({
        ctx,
        id: aiAgent.id,
        data: aiAgent,
      });
    }

    return ok();
  }

  async syncGitRepositoriesToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncGitRepositoriesToExternal
    >,
  ): Promise<Result<void, Err>> {
    const { ctx, projectId } = input;

    const resolveResult = await this.#resolveProjectAndCredential(
      ctx,
      projectId,
    );

    if (resolveResult.isErr()) {
      return err(resolveResult.error);
    }
    const { project, credential } = resolveResult.value;

    const findManyResult = await this.#gitRepositoryCrudRepository.findMany({
      ctx,
      filter: { projectId },
    });

    if (findManyResult.isErr()) {
      return err(findManyResult.error);
    }
    for (const gitRepository of findManyResult.value) {
      gitRepository.markProjectForSync({ projectId });

      await this.#gitRepositoryCrudRepository.update({
        ctx,
        id: gitRepository.id,
        data: gitRepository,
      });

      const syncResult =
        await this.#externalProjectService.syncGitRepositoryIssueField({
          ctx,
          credential,
          project,
          gitRepository,
        });

      if (syncResult.isOk()) {
        gitRepository.markProjectAsSynced({ projectId });
      } else {
        gitRepository.markProjectSyncError({ projectId });
      }

      await this.#gitRepositoryCrudRepository.update({
        ctx,
        id: gitRepository.id,
        data: gitRepository,
      });
    }

    return ok();
  }

  async syncWorkflowDefinitionsToExternal(
    input: z.infer<
      typeof projectSyncServiceInputSchema.syncWorkflowDefinitionsToExternal
    >,
  ): Promise<Result<void, Err>> {
    const { ctx, projectId } = input;

    const resolveResult = await this.#resolveProjectAndCredential(
      ctx,
      projectId,
    );

    if (resolveResult.isErr()) {
      return err(resolveResult.error);
    }
    const { project, credential } = resolveResult.value;

    const findManyResult =
      await this.#workflowDefinitionCrudRepository.findMany({
        ctx,
        filter: { projectId },
      });

    if (findManyResult.isErr()) {
      return err(findManyResult.error);
    }
    for (const workflowDefinition of findManyResult.value) {
      workflowDefinition.markProjectForSync({ projectId });

      await this.#workflowDefinitionCrudRepository.update({
        ctx,
        id: workflowDefinition.id,
        data: workflowDefinition,
      });

      const syncResult =
        await this.#externalProjectService.syncWorkflowDefinitionIssueField({
          ctx,
          credential,
          project,
          workflowDefinition,
        });

      if (syncResult.isOk()) {
        workflowDefinition.markProjectAsSynced({ projectId });
      } else {
        workflowDefinition.markProjectSyncError({ projectId });
      }

      await this.#workflowDefinitionCrudRepository.update({
        ctx,
        id: workflowDefinition.id,
        data: workflowDefinition,
      });
    }

    return ok();
  }

  async #resolveProjectAndCredential(
    ctx: z.infer<
      typeof projectSyncServiceInputSchema.syncAiAgentsToExternal
    >["ctx"],
    projectId: string,
  ): Promise<
    Result<{ project: ProjectEntity; credential: CredentialEntity }, Err>
  > {
    const projectResult = await this.#projectCrudRepository.findOne({
      ctx,
      id: projectId,
    });

    if (projectResult.isErr()) {
      return err(projectResult.error);
    }
    const project = projectResult.value;

    if (isNil(project)) {
      return err(Err.code("notFound", { message: "Project not found" }));
    }
    const integration = project.props.integration;

    if (isNil(integration)) {
      return err(
        Err.code("badRequest", {
          message: "Project has no integration configured",
        }),
      );
    }
    const credentialResult = await this.#credentialCrudRepository.findOne({
      ctx,
      id: integration.credentialId,
    });

    if (credentialResult.isErr()) {
      return err(credentialResult.error);
    }
    const credential = credentialResult.value;

    if (isNil(credential)) {
      return err(Err.code("notFound", { message: "Credential not found" }));
    }
    return ok({ project, credential });
  }
}
