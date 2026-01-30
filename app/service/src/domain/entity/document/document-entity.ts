import { ok } from "neverthrow";
import z from "zod";
import { type EntityIdInput, newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

export const documentEntityProps = z.object({
  content: z.string().min(1).max(100000),
  projectId: z.ulid().nullable(),
  title: z.string().min(1).max(1000),
});
export type DocumentEntityProps = z.output<typeof documentEntityProps>;

export class DocumentEntity extends TenantAwareEntity<DocumentEntityProps> {
  static makeNew(tenant: Tenant, props: DocumentEntityProps) {
    return ok(new DocumentEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: DocumentEntityProps,
  ) {
    return ok(
      new DocumentEntity(id, tenant, props, { createdAt, updatedAt }),
    );
  }
}
