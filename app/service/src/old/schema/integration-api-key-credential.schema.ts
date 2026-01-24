import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
  makeTimestampColumnType,
} from "@/old/schema/shared.schema";

export const integrationApiKeyCredentialTable = pgTable(
  "integration_api_key_credential",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    apiKey: varchar({ length: 256 }).notNull(),
    expiredAt: makeTimestampColumnType().notNull(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(
      table,
      "integration_api_key_credential",
    ),
  ],
);

export const integrationApiKeyCredentialSelectSchema = createSelectSchema(
  integrationApiKeyCredentialTable,
);
export type IntegrationApiKeyCredentialSelect = z.infer<
  typeof integrationApiKeyCredentialSelectSchema
>;
