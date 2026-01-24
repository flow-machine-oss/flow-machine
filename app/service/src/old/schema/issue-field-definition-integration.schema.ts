import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldDefinitionTable } from "@/old/schema/issue-field-definition.schema";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

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
    index(
      "issue_field_definition_integration_issue_field_definition_id_idx",
    ).on(table.issueFieldDefinitionId),
    index("issue_field_definition_integration_provider_id_external_id_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
