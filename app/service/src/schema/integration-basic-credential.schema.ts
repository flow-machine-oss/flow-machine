import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDateColumnType,
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const integrationBasicCredentialTable = pgTable(
  "integrationBasicCredential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    username: varchar({ length: 256 }).notNull(),
    password: varchar({ length: 256 }).notNull(),
    expiredAt: makeDateColumnType().notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table)],
);
