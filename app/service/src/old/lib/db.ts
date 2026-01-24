import { SQL } from "bun";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { config } from "@/old/lib/config";
import { aiAgentTable } from "@/old/schema/ai-agent.schema";
import { documentTable } from "@/old/schema/document.schema";
import { gitRepositoryIntegrationTable } from "@/old/schema/git-repository-integration.schema";
import { gitRepositoryTable } from "@/old/schema/git-repository.schema";
import { integrationApiKeyCredentialTable } from "@/old/schema/integration-api-key-credential.schema";
import { integrationBasicCredentialTable } from "@/old/schema/integration-basic-credential.schema";
import { issueFieldDefinitionIntegrationTable } from "@/old/schema/issue-field-definition-integration.schema";
import { issueFieldDefinitionTable } from "@/old/schema/issue-field-definition.schema";
import { issueFieldInstanceIntegrationTable } from "@/old/schema/issue-field-instance-integration.schema";
import { issueFieldInstanceTable } from "@/old/schema/issue-field-instance.schema";
import { issueIntegrationTable } from "@/old/schema/issue-integration.schema";
import { issueTable } from "@/old/schema/issue.schema";
import { projectIntegrationTable } from "@/old/schema/project-integration.schema";
import { projectTable } from "@/old/schema/project.schema";
import { relation } from "@/old/schema/relation";
import { workflowTable } from "@/old/schema/workflow.schema";

const client = new SQL(config.database.url);

export const db = drizzle({
  client,
  schema: {
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
  relations: relation,
  casing: "snake_case",
});
export type Db = typeof db;
