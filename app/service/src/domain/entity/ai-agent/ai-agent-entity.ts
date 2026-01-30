import { ok } from "neverthrow";
import z from "zod";
import { newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

export const aiModels = ["gpt-3.5-turbo", "gpt-4"] as const;

export const aiAgentEntityProps = z.object({
  name: z.string().min(1).max(256),
  model: z.enum(aiModels),
});
export type AiAgentEntityProps = z.output<typeof aiAgentEntityProps>;

export class AiAgentEntity extends TenantAwareEntity<AiAgentEntityProps> {
  static makeNew(tenant: Tenant, props: AiAgentEntityProps) {
    return ok(new AiAgentEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: AiAgentEntityProps,
  ) {
    return ok(
      new AiAgentEntity(id, tenant, props, {
        createdAt,
        updatedAt,
      }),
    );
  }
}
