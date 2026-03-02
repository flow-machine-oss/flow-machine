import { AiAgentBasicCrudService } from "@/app/domain/ai-agent/basic-crud-service";
import { CredentialBasicCrudService } from "@/app/domain/credential/basic-crud-service";
import { DocumentBasicCrudService } from "@/app/domain/document/basic-crud-service";
import { GitRepositoryBasicCrudService } from "@/app/domain/git-repository/basic-crud-service";
import { ProjectBasicCrudService } from "@/app/domain/project/basic-crud-service";
import { WorkflowDefinitionBasicCrudService } from "@/app/domain/workflow/definition/basic-crud-service";
import { ProjectSyncBasicService } from "@/app/feature/project/sync/basic-service";
import { WorkflowSdlcActionDefinitionCrudService } from "@/app/feature/workflow/sdlc/action-definition-service";
import { WorkflowSdlcFunctionFactory } from "@/app/feature/workflow/sdlc/durable-function-factory";
import {
  envConfigService,
  inngestClient,
  jiraExternalProjectService,
  mongoClient,
} from "@/di/infra";
import { InngestFunctionFactory } from "@/infra/inngest/function-factory";
import { InngestWorkflowEngineFactory } from "@/infra/inngest/workflow/engine-factory";
import { AiAgentMongoCrudRepository } from "@/infra/mongo/ai-agent/crud-repository";
import { CredentialMongoCrudRepository } from "@/infra/mongo/credential/crud-repository";
import { DocumentMongoCrudRepository } from "@/infra/mongo/document/crud-repository";
import { GitRepositoryMongoCrudRepository } from "@/infra/mongo/git-repository/crud-repository";
import { ProjectMongoCrudRepository } from "@/infra/mongo/project/crud-repository";
import { WorkflowDefinitionMongoCrudRepository } from "@/infra/mongo/workflow/definition/crud-repository";

// Repositories
const projectMongoCrudRepository = new ProjectMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const credentialMongoCrudRepository = new CredentialMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const aiAgentMongoCrudRepository = new AiAgentMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const gitRepositoryMongoCrudRepository = new GitRepositoryMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const documentMongoCrudRepository = new DocumentMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const workflowDefinitionMongoCrudRepository =
  new WorkflowDefinitionMongoCrudRepository(envConfigService, mongoClient);

// Domain services
const projectBasicCrudService = new ProjectBasicCrudService(
  projectMongoCrudRepository,
);
const credentialBasicCrudService = new CredentialBasicCrudService(
  credentialMongoCrudRepository,
);
const aiAgentBasicCrudService = new AiAgentBasicCrudService(
  aiAgentMongoCrudRepository,
);
const gitRepositoryBasicCrudService = new GitRepositoryBasicCrudService(
  gitRepositoryMongoCrudRepository,
);
const documentBasicCrudService = new DocumentBasicCrudService(
  documentMongoCrudRepository,
);
const workflowDefinitionBasicCrudService =
  new WorkflowDefinitionBasicCrudService(workflowDefinitionMongoCrudRepository);
const workflowActionDefinitionBasicCrudService =
  new WorkflowSdlcActionDefinitionCrudService();

// Feature services
const projectSyncBasicService = new ProjectSyncBasicService(
  projectBasicCrudService,
  credentialBasicCrudService,
  aiAgentBasicCrudService,
  gitRepositoryBasicCrudService,
  workflowDefinitionBasicCrudService,
  jiraExternalProjectService,
);

// Inngest orchestration
const inngestFunctionFactory = new InngestFunctionFactory(inngestClient);
const inngestWorkflowEngineFactory = new InngestWorkflowEngineFactory(
  workflowDefinitionBasicCrudService,
);
const inngestWorkflowSdlcFunctionFactory = new WorkflowSdlcFunctionFactory(
  inngestFunctionFactory,
  inngestWorkflowEngineFactory,
  workflowActionDefinitionBasicCrudService,
);

export {
  aiAgentBasicCrudService,
  aiAgentMongoCrudRepository,
  credentialBasicCrudService,
  credentialMongoCrudRepository,
  documentBasicCrudService,
  documentMongoCrudRepository,
  gitRepositoryBasicCrudService,
  gitRepositoryMongoCrudRepository,
  inngestFunctionFactory,
  inngestWorkflowEngineFactory,
  inngestWorkflowSdlcFunctionFactory,
  projectBasicCrudService,
  projectMongoCrudRepository,
  projectSyncBasicService,
  workflowActionDefinitionBasicCrudService,
  workflowDefinitionBasicCrudService,
  workflowDefinitionMongoCrudRepository,
};
