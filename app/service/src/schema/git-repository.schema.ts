import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const gitRepositoryTable = pgTable(
  "gitRepository",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    contributorEmail: varchar({ length: 256 }).notNull(),
    contributorName: varchar({ length: 256 }).notNull(),
    name: varchar({ length: 256 }).notNull(),
    url: varchar({ length: 256 }).notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table, "gitRepository")],
);
