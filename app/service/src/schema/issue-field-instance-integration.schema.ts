import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldInstanceTable } from "@/schema/issue-field-instance.schema";
import { projectIntegrationProviderIds } from "@/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldInstanceIntegrationTable = pgTable(
  "issueFieldInstanceIntegration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: makeIdColumnType().notNull(),
    providerId: text({ enum: projectIntegrationProviderIds }).notNull(),

    issueFieldInstanceId: makeIdColumnType()
      .notNull()
      .references(() => issueFieldInstanceTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(
      table,
      "issueFieldInstanceIntegration",
    ),
    index("issueFieldInstanceIntegration_issueFieldInstanceId_idx").on(
      table.issueFieldInstanceId,
    ),
    index("issueFieldInstanceIntegration_providerId_externalId_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
