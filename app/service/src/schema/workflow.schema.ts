import { Workflow as WorkflowDefinition } from "@inngest/workflow-kit";
import { index, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const workflowStatuses = ["draft", "active"] as const;

export const workflowTable = pgTable(
  "workflow",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    name: varchar({ length: 256 }).notNull(),
    description: text(),
    status: text({ enum: workflowStatuses }).notNull().default("draft"),
    definition: jsonb().notNull().$type<WorkflowDefinition>(),
  },
  (table) => [
    ...makeDefaultOrganizationAwareIndexes(table, "workflow"),
    index("workflow_status_idx").on(table.status),
  ],
);

export const workflowSelectSchema = createSelectSchema(workflowTable);
export type WorkflowSelect = z.infer<typeof workflowSelectSchema>;
