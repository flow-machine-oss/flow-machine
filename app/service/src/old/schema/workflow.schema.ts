import { type Workflow as WorkflowDefinition } from "@inngest/workflow-kit";
import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/old/schema/shared.schema";

export const workflowTable = pgTable(
  "workflow",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    name: varchar({ length: 256 }).notNull(),
    description: text().notNull(),
    definition: jsonb().notNull().$type<WorkflowDefinition>(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table, "workflow")],
);

export const workflowSelectSchema = createSelectSchema(workflowTable);
export type WorkflowSelect = z.infer<typeof workflowSelectSchema>;
