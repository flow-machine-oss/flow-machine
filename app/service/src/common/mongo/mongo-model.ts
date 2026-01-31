import type { UnknownRecord } from "type-fest";
import z from "zod";
import type { Entity } from "@/common/domain/entity";
import { type EntityId, entityIdSchema } from "@/common/domain/entity-id";
import {
  type Tenant,
  type TenantAwareEntity,
  tenantSchema,
} from "@/common/domain/tenant-aware-entity";

export const baseMongoModelSchema = z.object({
  _id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type MongoModel<T> = T & {
  _id: EntityId;
  createdAt: Date;
  updatedAt: Date;
};

export const baseTenantAwareMongoModelSchema = baseMongoModelSchema.extend({
  tenant: tenantSchema,
});
export type TenantAwareMongoModel<T> = MongoModel<T> & {
  tenant: Tenant;
};

export const entityToMongoModel = <
  T extends UnknownRecord,
  K extends Entity<T>,
>(
  entity: K,
): MongoModel<T> => ({
  _id: entity.id,

  ...entity.props,

  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
});

export const tenantAwareEntityToMongoModel = <
  T extends UnknownRecord,
  K extends TenantAwareEntity<T>,
>(
  entity: K,
): TenantAwareMongoModel<T> => ({
  _id: entity.id,
  tenant: entity.tenant,

  ...entity.props,

  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
});
