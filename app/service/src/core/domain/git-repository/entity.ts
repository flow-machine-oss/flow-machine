import { UTCDate } from "@date-fns/utc";
import z from "zod";
import {
  type EntityId,
  entityIdSchema,
  newEntityId,
} from "@/core/domain/entity";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/core/domain/tenant-aware-entity";

const gitProviders = ["github", "gitlab"] as const;

const gitRepositoryEntityProps = z.object({
  name: z.string().min(1).max(256),
  url: z.url().max(2048),
  config: z.object({
    defaultBranch: z.string().min(1).max(256),
    email: z.email().max(256),
    username: z.string().min(1).max(256),
  }),
  integration: z.object({
    provider: z.enum(gitProviders),
    credentialId: entityIdSchema,
  }),
  projects: z
    .object({
      id: entityIdSchema,
      syncStatus: z.enum(["idle", "pending", "success", "error"]),
      syncedAt: z.date().nullable(),
    })
    .array(),
});
type GitRepositoryEntityProps = z.output<typeof gitRepositoryEntityProps>;

class GitRepositoryEntity extends TenantAwareEntity<GitRepositoryEntityProps> {
  static makeNew(tenant: Tenant, props: GitRepositoryEntityProps) {
    return new GitRepositoryEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: GitRepositoryEntityProps,
  ) {
    return new GitRepositoryEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }

  markProjectForSync({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "pending";
    this.updatedAt = new UTCDate();
  }

  markProjectAsSynced({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "success";
    project.syncedAt = new UTCDate();
    this.updatedAt = new UTCDate();
  }

  markProjectSyncError({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "error";
    this.updatedAt = new UTCDate();
  }
}

export {
  GitRepositoryEntity,
  gitRepositoryEntityProps,
  type GitRepositoryEntityProps,
};
