import { ProjectSyncBasicService } from "@/app/feature/project/sync/basic-service";
import {
  envConfigService,
  jiraExternalProjectService,
  mongoClient,
} from "@/di/shared";
import { AiAgentMongoCrudRepository } from "@/infra/mongo/ai-agent/crud-repository";
import { CredentialMongoCrudRepository } from "@/infra/mongo/credential/crud-repository";
import { GitRepositoryMongoCrudRepository } from "@/infra/mongo/git-repository/crud-repository";
import { ProjectMongoCrudRepository } from "@/infra/mongo/project/crud-repository";
import { WorkflowDefinitionMongoCrudRepository } from "@/infra/mongo/workflow/definition/crud-repository";

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
const workflowDefinitionMongoCrudRepository =
  new WorkflowDefinitionMongoCrudRepository(envConfigService, mongoClient);

const projectSyncBasicService = new ProjectSyncBasicService(
  projectMongoCrudRepository,
  credentialMongoCrudRepository,
  aiAgentMongoCrudRepository,
  gitRepositoryMongoCrudRepository,
  workflowDefinitionMongoCrudRepository,
  jiraExternalProjectService,
);

export { projectSyncBasicService };
