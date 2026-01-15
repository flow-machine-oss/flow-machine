import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
  makeTimestampColumnType,
} from "@/schema/shared.schema";

export const integrationApiKeyCredentialTable = pgTable(
  "integrationApiKeyCredential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    apiKey: varchar({ length: 256 }).notNull(),
    expiredAt: makeTimestampColumnType().notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "integrationApiKeyCredential"),
  ],
);
