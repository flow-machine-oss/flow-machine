import type { EmptyObject, UnknownRecord } from "type-fest";
import { Entity } from "@/common/domain/entity";
import type { EntityId } from "@/common/domain/entity-id";

export class TenantAwareEntity<
  T extends UnknownRecord = EmptyObject,
> extends Entity<T> {
  tenantId: string;

  constructor(
    id: EntityId,
    tenantId: string,
    requiredProps: T,
    optionalProps?: { createdAt: Date; updatedAt: Date },
  ) {
    super(id, requiredProps, optionalProps);
    this.tenantId = tenantId;
  }
}
