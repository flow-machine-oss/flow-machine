import { ok } from "neverthrow";
import z from "zod";
import { type EntityIdInput, newEntityId } from "@/common/domain/entity-id";
import { TenantAwareEntity } from "@/common/domain/tenant-aware-entity";

export const documentEntityProps = z.object({
  content: z.string().min(1).max(100000),
  projectId: z.ulid().nullable(),
  title: z.string().min(1).max(1000),
});
export type DocumentEntityProps = z.output<typeof documentEntityProps>;

export class DocumentEntity extends TenantAwareEntity<DocumentEntityProps> {
  static makeNew(tenantId: string, props: DocumentEntityProps) {
    return ok(new DocumentEntity(newEntityId(), tenantId, props));
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenantId: string,
    props: DocumentEntityProps,
  ) {
    return ok(
      new DocumentEntity(id, tenantId, props, { createdAt, updatedAt }),
    );
  }
}
