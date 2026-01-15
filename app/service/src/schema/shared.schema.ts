import { ColumnType } from "drizzle-orm";
import {
  ExtraConfigColumn,
  PgColumnBaseConfig,
  index,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const makeIdColumnType = () => varchar({ length: 32 });

export const makeTimestampColumnType = () =>
  timestamp({ mode: "date", withTimezone: true });

export const makeBaseSchemaTableColumns = () =>
  ({
    id: makeIdColumnType().primaryKey(),
    createdAt: makeTimestampColumnType().notNull().defaultNow(),
    updatedAt: makeTimestampColumnType()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
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
  tableName: string,
) => [index(`${tableName}_organizationId_idx`).on(table.organizationId)];
