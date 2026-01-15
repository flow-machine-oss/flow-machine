import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { issueFieldTypes } from "@/schema/issue-field-type.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldDefinitionTable = pgTable(
  "issue_field_definition",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    name: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 256 }).notNull(),
    fieldType: text({ enum: issueFieldTypes }).notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "issue_field_definition"),
  ],
);
