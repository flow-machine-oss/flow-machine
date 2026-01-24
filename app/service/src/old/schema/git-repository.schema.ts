import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const gitRepositoryTable = pgTable(
  "git_repository",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    contributorEmail: varchar({ length: 256 }).notNull(),
    contributorName: varchar({ length: 256 }).notNull(),
    name: varchar({ length: 256 }).notNull(),
    url: varchar({ length: 256 }).notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table, "git_repository")],
);

export const gitRepositorySelectSchema = createSelectSchema(gitRepositoryTable);
export type GitRepositorySelect = z.infer<typeof gitRepositorySelectSchema>;
