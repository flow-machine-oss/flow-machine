import { ColumnType } from "drizzle-orm";
import {
  ExtraConfigColumn,
  PgColumnBaseConfig,
  date,
  index,
  varchar,
} from "drizzle-orm/pg-core";

export const makeIdColumnType = () => varchar({ length: 32 });
export const makeDateColumnType = () => date({ mode: "date" });

export const makeBaseSchemaTableColumns = () =>
  ({
    id: makeIdColumnType().unique().primaryKey(),
    createdAt: makeDateColumnType().notNull(),
    updatedAt: makeDateColumnType().notNull(),
  }) as const;

export const makeOrganizationAwareBaseSchemaTableColumns = () =>
  ({
    ...makeBaseSchemaTableColumns(),
    organizationId: makeIdColumnType().notNull(),
  }) as const;

export const makeDefaultOrganizationAwareIndexes = <
  T extends {
    organizationId: ExtraConfigColumn<PgColumnBaseConfig<ColumnType>>;
  },
>(
  table: T,
) => [index("organizationId_idx").on(table.organizationId)];
