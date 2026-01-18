import { defineRelations } from "drizzle-orm";
import { aiAgentTable } from "@/schema/ai-agent.schema";
import { documentTable } from "@/schema/document.schema";
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
import { workflowTable } from "@/schema/workflow.schema";

export const relation = defineRelations(
  {
    aiAgent: aiAgentTable,
    document: documentTable,
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
    workflow: workflowTable,
  },
  (r) => ({
    document: {
      project: r.one.project({
        from: r.document.projectId,
        to: r.project.id,
      }),
    },

    gitRepository: {
      integration: r.one.gitRepositoryIntegration({
        from: r.gitRepository.id,
        to: r.gitRepositoryIntegration.gitRepositoryId,
      }),
    },
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

    issue: {
      project: r.one.project({
        from: r.issue.projectId,
        to: r.project.id,
      }),
      fieldInstances: r.many.issueFieldInstance(),
      integration: r.one.issueIntegration(),
    },
    issueIntegration: {
      issue: r.one.issue({
        from: r.issueIntegration.issueId,
        to: r.issue.id,
      }),
    },

    issueFieldDefinition: {
      issueFieldInstances: r.many.issueFieldInstance(),
      integration: r.one.issueFieldDefinitionIntegration(),
    },
    issueFieldDefinitionIntegration: {
      issueFieldDefinition: r.one.issueFieldDefinition({
        from: r.issueFieldDefinitionIntegration.issueFieldDefinitionId,
        to: r.issueFieldDefinition.id,
      }),
    },

    issueFieldInstance: {
      issue: r.one.issue({
        from: r.issueFieldInstance.issueId,
        to: r.issue.id,
      }),
      issueFieldDefinition: r.one.issueFieldDefinition({
        from: r.issueFieldInstance.issueFieldDefinitionId,
        to: r.issueFieldDefinition.id,
      }),
      integration: r.one.issueFieldInstanceIntegration(),
    },
    issueFieldInstanceIntegration: {
      issueFieldInstance: r.one.issueFieldInstance({
        from: r.issueFieldInstanceIntegration.issueFieldInstanceId,
        to: r.issueFieldInstance.id,
      }),
    },

    integrationApiKeyCredential: {
      projectIntegrations: r.many.projectIntegration({
        from: r.integrationApiKeyCredential.id,
        to: r.projectIntegration.credentialId,
      }),
    },
    integrationBasicCredential: {
      gitRepositoryIntegration: r.one.gitRepositoryIntegration({
        from: r.integrationBasicCredential.id,
        to: r.gitRepositoryIntegration.credentialId,
      }),
    },

    project: {
      issues: r.many.issue(),
      documents: r.many.document(),
      integration: r.one.projectIntegration(),
    },
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
  }),
);
