import { createSelectSchema } from "drizzle-zod";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import type z from "zod";
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

export const projectSelectSchema = createSelectSchema(projectTable);
export type ProjectSelect = z.infer<typeof projectSelectSchema>;
