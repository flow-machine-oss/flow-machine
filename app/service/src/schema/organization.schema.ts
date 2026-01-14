import { pgTable } from "drizzle-orm/pg-core";
import {
  makeBaseSchemaTableColumns,
  makeIdColumnType,
} from "@/schema/shared.schema";

export const organizationTable = pgTable("organization", {
  ...makeBaseSchemaTableColumns(),

  externalId: makeIdColumnType().notNull().unique(),
});
