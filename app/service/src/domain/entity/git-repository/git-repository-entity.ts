import { ok } from "neverthrow";
import z from "zod";
import { entityIdSchema, newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";
import { gitProviders } from "@/domain/entity/provider/git-provider";

export const gitRepositoryEntityProps = z.object({
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
});
export type GitRepositoryEntityProps = z.output<
  typeof gitRepositoryEntityProps
>;

export class GitRepositoryEntity extends TenantAwareEntity<GitRepositoryEntityProps> {
  static makeNew(tenant: Tenant, props: GitRepositoryEntityProps) {
    return ok(new GitRepositoryEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: GitRepositoryEntityProps,
  ) {
    return ok(
      new GitRepositoryEntity(id, tenant, props, {
        createdAt,
        updatedAt,
      }),
    );
  }
}
