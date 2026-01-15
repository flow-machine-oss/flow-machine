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
import { organizationMemberTable } from "@/schema/organization-member.schema";
import { organizationTable } from "@/schema/organization.schema";
import { projectIntegrationTable } from "@/schema/project-integration.schema";
import { projectTable } from "@/schema/project.schema";
import { userTable } from "@/schema/user.schema";

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
    organization: organizationTable,
    organizationMember: organizationMemberTable,
    projectIntegration: projectIntegrationTable,
    project: projectTable,
    user: userTable,
  },
  (r) => ({
    // Organization relations (one-to-many)
    organization: {
      projects: r.many.project(),
      issues: r.many.issue(),
      issueFieldDefinitions: r.many.issueFieldDefinition(),
      aiAgents: r.many.aiAgent(),
      gitRepositories: r.many.gitRepository(),
      integrationBasicCredentials: r.many.integrationBasicCredential(),
      integrationApiKeyCredentials: r.many.integrationApiKeyCredential(),
      members: r.many.organizationMember(),
    },

    // User relations
    user: {
      organizationMemberships: r.many.organizationMember(),
    },

    // Organization Member relations (junction table)
    organizationMember: {
      organization: r.one.organization({
        from: r.organizationMember.organizationId,
        to: r.organization.id,
      }),
      user: r.one.user({
        from: r.organizationMember.userId,
        to: r.user.id,
      }),
    },

    // Project relations
    project: {
      organization: r.one.organization({
        from: r.project.organizationId,
        to: r.organization.id,
      }),
      issues: r.many.issue(),
      projectIntegrations: r.many.projectIntegration(),
    },

    // AI Agent relations
    aiAgent: {
      organization: r.one.organization({
        from: r.aiAgent.organizationId,
        to: r.organization.id,
      }),
    },

    // Git Repository relations
    gitRepository: {
      organization: r.one.organization({
        from: r.gitRepository.organizationId,
        to: r.organization.id,
      }),
      gitRepositoryIntegrations: r.many.gitRepositoryIntegration(),
    },

    // Integration Basic Credential relations
    integrationBasicCredential: {
      organization: r.one.organization({
        from: r.integrationBasicCredential.organizationId,
        to: r.organization.id,
      }),
      gitRepositoryIntegrations: r.many.gitRepositoryIntegration(),
    },

    // Integration API Key Credential relations
    integrationApiKeyCredential: {
      organization: r.one.organization({
        from: r.integrationApiKeyCredential.organizationId,
        to: r.organization.id,
      }),
      projectIntegrations: r.many.projectIntegration(),
    },

    // Issue relations
    issue: {
      organization: r.one.organization({
        from: r.issue.organizationId,
        to: r.organization.id,
      }),
      project: r.one.project({
        from: r.issue.projectId,
        to: r.project.id,
      }),
      issueFieldInstances: r.many.issueFieldInstance(),
      issueIntegrations: r.many.issueIntegration(),
    },

    // Issue Field Definition relations
    issueFieldDefinition: {
      organization: r.one.organization({
        from: r.issueFieldDefinition.organizationId,
        to: r.organization.id,
      }),
      issueFieldInstances: r.many.issueFieldInstance(),
      issueFieldDefinitionIntegrations:
        r.many.issueFieldDefinitionIntegration(),
    },

    // Issue Field Instance relations
    issueFieldInstance: {
      organization: r.one.organization({
        from: r.issueFieldInstance.organizationId,
        to: r.organization.id,
      }),
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
      organization: r.one.organization({
        from: r.gitRepositoryIntegration.organizationId,
        to: r.organization.id,
      }),
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
      organization: r.one.organization({
        from: r.projectIntegration.organizationId,
        to: r.organization.id,
      }),
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
      organization: r.one.organization({
        from: r.issueIntegration.organizationId,
        to: r.organization.id,
      }),
      issue: r.one.issue({
        from: r.issueIntegration.issueId,
        to: r.issue.id,
      }),
    },

    // Issue Field Definition Integration relations
    issueFieldDefinitionIntegration: {
      organization: r.one.organization({
        from: r.issueFieldDefinitionIntegration.organizationId,
        to: r.organization.id,
      }),
      issueFieldDefinition: r.one.issueFieldDefinition({
        from: r.issueFieldDefinitionIntegration.issueFieldDefinitionId,
        to: r.issueFieldDefinition.id,
      }),
    },

    // Issue Field Instance Integration relations
    issueFieldInstanceIntegration: {
      organization: r.one.organization({
        from: r.issueFieldInstanceIntegration.organizationId,
        to: r.organization.id,
      }),
      issueFieldInstance: r.one.issueFieldInstance({
        from: r.issueFieldInstanceIntegration.issueFieldInstanceId,
        to: r.issueFieldInstance.id,
      }),
    },
  }),
);
