import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { issueTable } from "@/schema/issue.schema";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueIntegrationTable = pgTable(
  "issueIntegration",
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
    ...makeDefaultOrganizationAwareIndexes(table, "issueIntegration"),
    index("issueIntegration_issueId_idx").on(table.issueId),
    index("issueIntegration_providerId_externalId_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
