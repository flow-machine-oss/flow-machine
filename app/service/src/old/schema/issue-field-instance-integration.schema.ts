import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldInstanceTable } from "@/old/schema/issue-field-instance.schema";
import { projectIntegrationProviderIds } from "@/old/schema/project-integration.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const issueFieldInstanceIntegrationTable = pgTable(
  "issue_field_instance_integration",
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
      "issue_field_instance_integration",
    ),
    index("issue_field_instance_integration_issue_field_instance_id_idx").on(
      table.issueFieldInstanceId,
    ),
    index("issue_field_instance_integration_provider_id_external_id_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);
