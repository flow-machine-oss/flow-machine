import { defineRelations } from "drizzle-orm";
import { aiAgentTable } from "@/schema/ai-agent.schema";
import { gitRepositoryIntegrationTable } from "@/schema/git-repository-integration.schema";
import { gitRepositoryTable } from "@/schema/git-repository.schema";
import { integrationApiKeyCredentialTable } from "@/schema/integration-api-key-credential.schema";
import { integrationBasicCredentialTable } from "@/schema/integration-basic-credential.schema";
import { issueFieldDefinitionIntegrationTable } from "@/schema/issue-field-definition-integration.schema";
import { issueFieldDefinitionTable } from "@/schema/issue-field-definition.schema";
import { issueFieldInstanceIntegrationTable } from "@/schema/issue-field-instance-integration.schema";
import { issueFieldInstanceTable } from "@/schema/issue-field-instance.schema";
import { issueIntegrationTable } from "@/schema/issue-integration.schema";
import { issueTable } from "@/schema/issue.schema";
import { projectIntegrationTable } from "@/schema/project-integration.schema";
import { projectTable } from "@/schema/project.schema";

export const relation = defineRelations(
  {
    aiAgent: aiAgentTable,
    gitRepositoryIntegration: gitRepositoryIntegrationTable,
    gitRepository: gitRepositoryTable,
    integrationApiKeyCredential: integrationApiKeyCredentialTable,
    integrationBasicCredential: integrationBasicCredentialTable,
    issueFieldDefinitionIntegration: issueFieldDefinitionIntegrationTable,
    issueFieldDefinition: issueFieldDefinitionTable,
    issueFieldInstanceIntegration: issueFieldInstanceIntegrationTable,
    issueFieldInstance: issueFieldInstanceTable,
    issueIntegration: issueIntegrationTable,
    issue: issueTable,
    projectIntegration: projectIntegrationTable,
    project: projectTable,
  },
  (r) => ({
    // Project relations
    project: {
      issues: r.many.issue(),
      projectIntegrations: r.many.projectIntegration(),
    },

    // Git Repository relations
    gitRepository: {
      gitRepositoryIntegrations: r.many.gitRepositoryIntegration(),
    },

    // Integration Basic Credential relations
    integrationBasicCredential: {
      gitRepositoryIntegrations: r.many.gitRepositoryIntegration(),
    },

    // Integration API Key Credential relations
    integrationApiKeyCredential: {
      projectIntegrations: r.many.projectIntegration(),
    },

    // Issue relations
    issue: {
      project: r.one.project({
        from: r.issue.projectId,
        to: r.project.id,
      }),
      issueFieldInstances: r.many.issueFieldInstance(),
      issueIntegrations: r.many.issueIntegration(),
    },

    // Issue Field Definition relations
    issueFieldDefinition: {
      issueFieldInstances: r.many.issueFieldInstance(),
      issueFieldDefinitionIntegrations:
        r.many.issueFieldDefinitionIntegration(),
    },

    // Issue Field Instance relations
    issueFieldInstance: {
      issue: r.one.issue({
        from: r.issueFieldInstance.issueId,
        to: r.issue.id,
      }),
      issueFieldDefinition: r.one.issueFieldDefinition({
        from: r.issueFieldInstance.issueFieldDefinitionId,
        to: r.issueFieldDefinition.id,
      }),
      issueFieldInstanceIntegrations: r.many.issueFieldInstanceIntegration(),
    },

    // Git Repository Integration relations
    gitRepositoryIntegration: {
      credential: r.one.integrationBasicCredential({
        from: r.gitRepositoryIntegration.credentialId,
        to: r.integrationBasicCredential.id,
      }),
      gitRepository: r.one.gitRepository({
        from: r.gitRepositoryIntegration.gitRepositoryId,
        to: r.gitRepository.id,
      }),
    },

    // Project Integration relations
    projectIntegration: {
      credential: r.one.integrationApiKeyCredential({
        from: r.projectIntegration.credentialId,
        to: r.integrationApiKeyCredential.id,
      }),
      project: r.one.project({
        from: r.projectIntegration.projectId,
        to: r.project.id,
      }),
    },

    // Issue Integration relations
    issueIntegration: {
      issue: r.one.issue({
        from: r.issueIntegration.issueId,
        to: r.issue.id,
      }),
    },

    // Issue Field Definition Integration relations
    issueFieldDefinitionIntegration: {
      issueFieldDefinition: r.one.issueFieldDefinition({
        from: r.issueFieldDefinitionIntegration.issueFieldDefinitionId,
        to: r.issueFieldDefinition.id,
      }),
    },

    // Issue Field Instance Integration relations
    issueFieldInstanceIntegration: {
      issueFieldInstance: r.one.issueFieldInstance({
        from: r.issueFieldInstanceIntegration.issueFieldInstanceId,
        to: r.issueFieldInstance.id,
      }),
    },
  }),
);
