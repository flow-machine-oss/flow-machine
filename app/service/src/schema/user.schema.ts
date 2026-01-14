import { index, pgTable, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const userTable = pgTable(
  "user",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    externalId: varchar({ length: 32 }).notNull().unique(),
    email: varchar({ length: 256 }).notNull().unique(),
    firstName: varchar({ length: 256 }).notNull(),
    lastName: varchar({ length: 256 }).notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table),
    index("email_idx").on(table.email),
  ],
);

export const userSelectSchema = createSelectSchema(userTable);
export type UserSelect = z.infer<typeof userSelectSchema>;
