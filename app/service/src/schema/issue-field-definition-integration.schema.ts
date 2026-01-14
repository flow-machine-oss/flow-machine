import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldDefinitionTable } from "@/schema/issue-field-definition.schema";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldDefinitionIntegrationTable = pgTable(
  "issueFieldDefinitionIntegration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),

    issueFieldDefinitionId: makeIdColumnType()
      .notNull()
      .references(() => issueFieldDefinitionTable.id),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("issueFieldDefinitionId_idx").on(table.issueFieldDefinitionId),
    index("providerId_externalId_idx").on([table.providerId, table.externalId]),
  ],
);
