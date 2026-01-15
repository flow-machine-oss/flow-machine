import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
  makeTimestampColumnType,
} from "@/schema/shared.schema";

export const integrationApiKeyCredentialTable = pgTable(
  "integration_api_key_credential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    apiKey: varchar({ length: 256 }).notNull(),
    expiredAt: makeTimestampColumnType().notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "integration_api_key_credential"),
  ],
);
