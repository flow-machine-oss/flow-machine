import { index, pgEnum, pgTable, unique } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { organizationTable } from "@/schema/organization.schema";
import {
  makeBaseSchemaTableColumns,
  makeIdColumnType,
} from "@/schema/shared.schema";
import { userTable } from "@/schema/user.schema";

export const organizationMemberRoleEnum = pgEnum("organization_member_role", [
  "owner",
  "admin",
  "member",
]);

export const organizationMemberTable = pgTable(
  "organization_member",
  {
    ...makeBaseSchemaTableColumns(),
    organizationId: makeIdColumnType()
      .notNull()
      .references(() => organizationTable.id, { onDelete: "cascade" }),
    userId: makeIdColumnType()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: organizationMemberRoleEnum().notNull().default("member"),
  },
  (table) => [
    unique("organizationMember_organizationId_userId_unique").on(
      table.organizationId,
      table.userId,
    ),
    index("organizationMember_organizationId_idx").on(table.organizationId),
    index("organizationMember_userId_idx").on(table.userId),
  ],
);

export const organizationMemberSelectSchema = createSelectSchema(
  organizationMemberTable,
);
export type OrganizationMemberSelect = z.infer<
  typeof organizationMemberSelectSchema
>;
