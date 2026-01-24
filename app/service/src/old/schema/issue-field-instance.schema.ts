import { index, pgTable, text, unique } from "drizzle-orm/pg-core";
import { issueFieldDefinitionTable } from "@/old/schema/issue-field-definition.schema";
import { issueTable } from "@/old/schema/issue.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const issueFieldInstanceTable = pgTable(
  "issue_field_instance",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    value: text(),

    issueId: makeIdColumnType()
      .notNull()
      .references(() => issueTable.id, { onDelete: "cascade" }),
    issueFieldDefinitionId: makeIdColumnType()
      .notNull()
      .references(() => issueFieldDefinitionTable.id, { onDelete: "restrict" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "issue_field_instance"),
    index("issue_field_instance_issue_id_idx").on(table.issueId),
    index("issue_field_instance_issue_field_definition_id_idx").on(
      table.issueFieldDefinitionId,
    ),
    unique("issue_field_instance_issue_id_issue_field_definition_id_unique").on(
      table.issueId,
      table.issueFieldDefinitionId,
    ),
  ],
);
