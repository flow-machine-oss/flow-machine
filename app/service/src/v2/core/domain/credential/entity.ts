import z from "zod";
import { type EntityId, newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

const credentialEntityProps = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    name: z.string().min(1).max(256),
    apiKey: z.string().min(1).max(256),
    expiredAt: z.date(),
  }),
  z.object({
    type: z.literal("basic"),
    name: z.string().min(1).max(256),
    username: z.string().min(1).max(256),
    password: z.string().min(1).max(256),
    expiredAt: z.date(),
  }),
]);
type CredentialEntityProps = z.output<typeof credentialEntityProps>;

class CredentialEntity extends TenantAwareEntity<CredentialEntityProps> {
  static makeNew(tenant: Tenant, props: CredentialEntityProps) {
    return new CredentialEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: CredentialEntityProps,
  ) {
    return new CredentialEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { CredentialEntity, credentialEntityProps, type CredentialEntityProps };
