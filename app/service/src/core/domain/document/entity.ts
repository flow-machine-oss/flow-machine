import z from "zod";
import {
  type EntityId,
  entityIdSchema,
  newEntityId,
} from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

const documentEntityProps = z.object({
  content: z.string().min(1).max(100000),
  projectId: entityIdSchema.nullable(),
  title: z.string().min(1).max(1000),
});
type DocumentEntityProps = z.output<typeof documentEntityProps>;

class DocumentEntity extends TenantAwareEntity<DocumentEntityProps> {
  static makeNew(tenant: Tenant, props: DocumentEntityProps) {
    return new DocumentEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: DocumentEntityProps,
  ) {
    return new DocumentEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { DocumentEntity, documentEntityProps, type DocumentEntityProps };
