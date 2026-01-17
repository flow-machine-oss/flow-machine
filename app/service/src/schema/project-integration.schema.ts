import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { integrationApiKeyCredentialTable } from "@/schema/integration-api-key-credential.schema";
import { projectTable } from "@/schema/project.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const projectIntegrationProviderIds = ["jira", "linear"] as const;

export const projectIntegrationTable = pgTable(
  "project_integration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),
    webhookSecret: varchar({ length: 64 }).notNull(),

    credentialId: makeIdColumnType()
      .notNull()
      .references(() => integrationApiKeyCredentialTable.id, {
        onDelete: "restrict",
      }),
    projectId: makeIdColumnType()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "project_integration"),
    index("project_integration_credential_id_idx").on(table.credentialId),
    index("project_integration_project_id_idx").on(table.projectId),
    index("project_integration_provider_id_external_id_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
