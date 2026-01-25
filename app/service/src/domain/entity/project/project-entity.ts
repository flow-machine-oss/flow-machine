import { ok } from "neverthrow";
import z from "zod";
import { type EntityIdInput, entityIdSchema, newEntityId } from "@/common/domain/entity-id";
import { TenantAwareEntity } from "@/common/domain/tenant-aware-entity";

export const projectEntityProps = z.object({
  name: z.string().min(1).max(256),
  integration: z
    .object({
      externalId: z.string().min(1).max(32),
      externalKey: z.string().min(1).max(32),
      provider: z.enum(['jira', 'linear']),
      webhookSecret: z.string().min(1).max(32),
      credentialId: entityIdSchema,
    })
    .optional(),
});
export type ProjectEntityProps = z.output<typeof projectEntityProps>;

export class ProjectEntity extends TenantAwareEntity<ProjectEntityProps> {
  static makeNew(tenantId: string, props: ProjectEntityProps) {
    return ok(new ProjectEntity(newEntityId(), tenantId, props));
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenantId: string,
    props: ProjectEntityProps,
  ) {
    return ok(new ProjectEntity(id, tenantId, props, { createdAt, updatedAt }));
  }
}
