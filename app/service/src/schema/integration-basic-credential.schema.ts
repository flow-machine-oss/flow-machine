import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
  makeTimestampColumnType,
} from "@/schema/shared.schema";

export const integrationBasicCredentialTable = pgTable(
  "integration_basic_credential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    username: varchar({ length: 256 }).notNull(),
    password: varchar({ length: 256 }).notNull(),
    expiredAt: makeTimestampColumnType().notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(
      table,
      "integration_basic_credential",
    ),
  ],
);
