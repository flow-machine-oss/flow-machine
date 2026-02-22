import { ok } from "neverthrow";
import z from "zod";
import { type EntityIdInput, newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

export const credentialEntityProps = z.discriminatedUnion("type", [
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
export type CredentialEntityProps = z.output<typeof credentialEntityProps>;

export class CredentialEntity extends TenantAwareEntity<CredentialEntityProps> {
  static makeNew(tenant: Tenant, props: CredentialEntityProps) {
    return ok(new CredentialEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: CredentialEntityProps,
  ) {
    return ok(
      new CredentialEntity(id, tenant, props, { createdAt, updatedAt }),
    );
  }
}
