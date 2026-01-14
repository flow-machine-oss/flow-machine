import { index, pgTable } from "drizzle-orm/pg-core";
import { projectTable } from "@/schema/project.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const issueTable = pgTable(
  "issue",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    projectId: makeIdColumnType()
      .notNull()
      .references(() => projectTable.id),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("projectId_idx").on(table.projectId),
  ],
);
