import { ok } from "neverthrow";
import z from "zod";
import {
  type EntityIdInput,
  entityIdSchema,
  newEntityId,
} from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";
import { projectProviders } from "@/domain/entity/provider/project-provider";

export const projectEntityProps = z.object({
  name: z.string().min(1).max(256),
  integration: z
    .object({
      externalId: z.string().min(1).max(32),
      externalKey: z.string().min(1).max(32),
      provider: z.enum(projectProviders),
      webhookSecret: z.string().min(1).max(32),
      credentialId: entityIdSchema,
    })
    .optional(),
});
export type ProjectEntityProps = z.output<typeof projectEntityProps>;

export class ProjectEntity extends TenantAwareEntity<ProjectEntityProps> {
  static makeNew(tenant: Tenant, props: ProjectEntityProps) {
    return ok(new ProjectEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: ProjectEntityProps,
  ) {
    return ok(new ProjectEntity(id, tenant, props, { createdAt, updatedAt }));
  }
}
