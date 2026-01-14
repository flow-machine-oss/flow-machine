import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { issueFieldTypes } from "@/schema/issue-field-type.schema";
import { projectTable } from "@/schema/project.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueFieldDefinitionTable = pgTable(
  "issueFieldDefinition",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    name: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 256 }).notNull(),
    fieldType: text({ enum: issueFieldTypes }).notNull(),

    projectId: makeIdColumnType()
      .notNull()
      .references(() => projectTable.id),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("projectId_idx").on(table.projectId),
  ],
);
