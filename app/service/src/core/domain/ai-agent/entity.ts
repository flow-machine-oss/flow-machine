import z from "zod";
import {
  type EntityId,
  entityIdSchema,
  newEntityId,
} from "@/common/domain/entity-id";
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

const aiAgentEntityProps = z.object({
  name: z.string().min(1).max(256),
  model: z.enum(aiModels),
  projects: z.object({ id: entityIdSchema, ...syncSchema.shape }).array(),
});
type AiAgentEntityProps = z.output<typeof aiAgentEntityProps>;

class AiAgentEntity extends TenantAwareEntity<AiAgentEntityProps> {
  static makeNew(tenant: Tenant, props: AiAgentEntityProps) {
    return new AiAgentEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: AiAgentEntityProps,
  ) {
    return new AiAgentEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { AiAgentEntity, aiAgentEntityProps, type AiAgentEntityProps };
