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

export const issueEntityProps = z.object({
  title: z.string().min(1).max(512),
  description: z.string().min(1).max(32768).nullable(),

  integration: z
    .object({
      provider: z.enum(projectProviders),
      externalId: z.string().min(1).max(32),
      raw: z.unknown(),
    })
    .optional(),

  projectId: entityIdSchema.nullable(),
});
export type IssueEntityProps = z.infer<typeof issueEntityProps>;

export class IssueEntity extends TenantAwareEntity<IssueEntityProps> {
  static makeNew(tenant: Tenant, props: IssueEntityProps) {
    return new IssueEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: IssueEntityProps,
  ) {
    return new IssueEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }
}
