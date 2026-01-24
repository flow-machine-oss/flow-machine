import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { projectTable } from "@/old/schema/project.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const documentTable = pgTable(
  "document",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    title: varchar({ length: 256 }).notNull(),
    content: text().notNull(),

    projectId: makeIdColumnType().references(() => projectTable.id, {
      onDelete: "restrict",
    }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "document"),
    index("document_project_id_idx").on(table.projectId),
  ],
);

export const documentSelectSchema = createSelectSchema(documentTable);
export type DocumentSelect = z.infer<typeof documentSelectSchema>;
