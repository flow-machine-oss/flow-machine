import { index, pgTable, text } from "drizzle-orm/pg-core";
import { issueFieldDefinitionTable } from "@/schema/issue-field-definition.schema";
import { issueTable } from "@/schema/issue.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldInstanceTable = pgTable(
  "issueFieldInstance",
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
    ...makeDefaultOrganizationAwareIndexes(table, "issueFieldInstance"),
    index("issueFieldInstance_issueId_idx").on(table.issueId),
    index("issueFieldInstance_issueFieldDefinitionId_idx").on(
      table.issueFieldDefinitionId,
    ),
  ],
);
