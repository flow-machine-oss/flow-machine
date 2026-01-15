import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldDefinitionTable } from "@/schema/issue-field-definition.schema";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldDefinitionIntegrationTable = pgTable(
  "issue_field_definition_integration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),

    issueFieldDefinitionId: makeIdColumnType()
      .notNull()
      .references(() => issueFieldDefinitionTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(
      table,
      "issue_field_definition_integration",
    ),
    index("issue_field_definition_integration_issueFieldDefinitionId_idx").on(
      table.issueFieldDefinitionId,
    ),
    index("issue_field_definition_integration_providerId_externalId_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
