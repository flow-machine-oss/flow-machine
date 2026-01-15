import { pgTable } from "drizzle-orm/pg-core";
import { makeBaseSchemaTableColumns } from "@/schema/shared.schema";

export const organizationTable = pgTable("organization", {
  ...makeBaseSchemaTableColumns(),
});
