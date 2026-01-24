import type { UnknownRecord } from "type-fest";
import type { Entity } from "@/common/domain/entity";
import type { EntityId } from "@/common/domain/entity-id";
import type { TenantAwareEntity } from "@/common/domain/tenant-aware-entity";

export type MongoModel<T> = T & {
  _id: EntityId;
  createdAt: Date;
  updatedAt: Date;
};

export type TenantAwareMongoModel<T> = MongoModel<T> & {
  tenantId: string;
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
  tenantId: entity.tenantId,

  ...entity.props,

  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
});
