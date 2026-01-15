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

    projectId: makeIdColumnType().references(() => projectTable.id, {
      onDelete: "restrict",
    }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "issue"),
    index("issue_projectId_idx").on(table.projectId),
  ],
);
