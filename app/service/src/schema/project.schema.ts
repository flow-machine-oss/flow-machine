import { pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
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
    key: varchar({ length: 64 }).notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "project"),
    unique("project_organization_id_key_unique").on(
      table.organizationId,
      table.key,
    ),
  ],
);

export const projectSelectSchema = createSelectSchema(projectTable);
export type ProjectSelect = z.infer<typeof projectSelectSchema>;
