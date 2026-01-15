import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const projectTable = pgTable(
  "project",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    name: varchar({ length: 256 }).notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table, "project")],
);
