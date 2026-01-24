import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { issueTable } from "@/old/schema/issue.schema";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const issueIntegrationTable = pgTable(
  "issue_integration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    externalKey: varchar({ length: 32 }).notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),

    issueId: makeIdColumnType()
      .notNull()
      .references(() => issueTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "issue_integration"),
    index("issue_integration_issue_id_idx").on(table.issueId),
    index("issue_integration_provider_id_external_id_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
