import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  makeDateColumnType,
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const integrationApiKeyCredentialTable = pgTable(
  "integrationApiKeyCredential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    apiKey: varchar({ length: 256 }).notNull(),
    expiredAt: makeDateColumnType().notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table)],
);
