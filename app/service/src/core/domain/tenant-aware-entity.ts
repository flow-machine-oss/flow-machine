import type { EmptyObject, UnknownRecord } from "type-fest";
import z from "zod";
import { Entity, type EntityId, entityIdSchema } from "@/core/domain/entity";

export const tenantTypes = ["organization", "user"] as const;

export const tenantSchema = z.object({
  id: entityIdSchema,
  type: z.enum(tenantTypes),
});
export type Tenant = z.output<typeof tenantSchema>;

export class TenantAwareEntity<
  T extends UnknownRecord = EmptyObject,
> extends Entity<T> {
  tenant: Tenant;

  constructor(
    id: EntityId,
    tenant: Tenant,
    requiredProps: T,
    optionalProps?: { createdAt: Date; updatedAt: Date },
  ) {
    super(id, requiredProps, optionalProps);
    this.tenant = tenant;
  }
}
