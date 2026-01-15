import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import {
  makeDefaultOrganizationAwareIndexes,
  makeOrganizationAwareBaseSchemaTableColumns,
} from "@/schema/shared.schema";

export const aiAgentModels = [
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-opus-4.5",
  "anthropic/claude-sonnet-4.5",
  "minimax/minimax-m2.1",
  "x-ai/grok-code-fast-1",
  "z-ai/glm-4.7",
] as const;

export const aiAgentTable = pgTable(
  "aiAgent",
  {
    ...makeOrganizationAwareBaseSchemaTableColumns(),

    model: text({ enum: aiAgentModels }).notNull(),
    name: varchar({ length: 256 }).notNull(),
  },
  (table) => [...makeDefaultOrganizationAwareIndexes(table, "aiAgent")],
);
