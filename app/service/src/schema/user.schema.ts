import { index, pgTable, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { makeBaseSchemaTableColumns } from "@/schema/shared.schema";

export const userTable = pgTable(
  "user",
  {
    ...makeBaseSchemaTableColumns(),

    email: varchar({ length: 256 }).notNull().unique(),
    firstName: varchar({ length: 256 }).notNull(),
    lastName: varchar({ length: 256 }).notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)],
);

export const userSelectSchema = createSelectSchema(userTable);
export type UserSelect = z.infer<typeof userSelectSchema>;
