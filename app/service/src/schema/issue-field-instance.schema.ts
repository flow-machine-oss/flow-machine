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
      .references(() => issueTable.id),
    issueFieldDefinitionId: makeIdColumnType()
      .notNull()
      .references(() => issueFieldDefinitionTable.id),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("issueId_idx").on(table.issueId),
    index("issueFieldDefinitionId_idx").on(table.issueFieldDefinitionId),
  ],
);
