import { ok } from "neverthrow";
import z from "zod";
import { entityIdSchema, newEntityId } from "@/common/domain/entity-id";
import { syncSchema } from "@/common/domain/sync";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

const aiModels = [
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-opus-4.5",
  "anthropic/claude-sonnet-4.5",
  "minimax/minimax-m2.1",
  "x-ai/grok-code-fast-1",
  "z-ai/glm-4.7",
] as const;

export const aiAgentEntityProps = z.object({
  name: z.string().min(1).max(256),
  model: z.enum(aiModels),
  projects: z.object({ id: entityIdSchema, ...syncSchema.shape }).array(),
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
