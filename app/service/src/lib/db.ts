import { SQL } from "bun";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { config } from "@/lib/config";
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
import { organizationTable } from "@/schema/organization.schema";
import { projectIntegrationTable } from "@/schema/project-integration.schema";
import { projectTable } from "@/schema/project.schema";
import { relation } from "@/schema/relation";
import { userTable } from "@/schema/user.schema";

const client = new SQL(config.database.url);

export const db = drizzle({
  client,
  schema: {
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
    projectIntegration: projectIntegrationTable,
    project: projectTable,
    user: userTable,
  },
  relations: relation,
});
export type Db = typeof db;
