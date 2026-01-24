import { index, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { projectTable } from "@/old/schema/project.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

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
    index("issue_project_id_idx").on(table.projectId),
  ],
);

export const issueSelectSchema = createSelectSchema(issueTable);
export type IssueSelect = z.infer<typeof issueSelectSchema>;
