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
  "projectIntegration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    externalKey: varchar({ length: 32 }).notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),
    webhookSecret: varchar({ length: 32 }).notNull(),

    credentialId: makeIdColumnType()
      .notNull()
      .references(() => integrationApiKeyCredentialTable.id),
    projectId: makeIdColumnType()
      .notNull()
      .references(() => projectTable.id),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("credentialId_idx").on(table.credentialId),
    index("projectId_idx").on(table.projectId),
    index("providerId_externalId_idx").on([table.providerId, table.externalId]),
  ],
);
