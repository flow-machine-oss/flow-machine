import { index, pgTable, text } from "drizzle-orm/pg-core";
import { gitRepositoryTable } from "@/schema/git-repository.schema";
import { integrationBasicCredentialTable } from "@/schema/integration-basic-credential.schema";
import {
  makeDefaultOrganizationAwareIndexes,
  makeIdColumnType,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

const gitRepositoryProviderIds = ["gitHub", "gitLab"] as const;

export const gitRepositoryIntegrationTable = pgTable(
  "gitRepositoryIntegration",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    providerId: text({ enum: gitRepositoryProviderIds }).notNull(),

    credentialId: makeIdColumnType()
      .notNull()
      .references(() => integrationBasicCredentialTable.id, {
        onDelete: "restrict",
      }),
    gitRepositoryId: makeIdColumnType()
      .notNull()
      .references(() => gitRepositoryTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "gitRepositoryIntegration"),
    index("gitRepositoryIntegration_credentialId_idx").on(table.credentialId),
    index("gitRepositoryIntegration_gitRepositoryId_idx").on(
      table.gitRepositoryId,
    ),
  ],
);
