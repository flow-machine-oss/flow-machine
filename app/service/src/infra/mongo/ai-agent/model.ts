import type { AiAgentEntityProps } from "@/core/domain/ai-agent/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type AiAgentMongoModel = TenantAwareMongoModel<AiAgentEntityProps>;

export type { AiAgentMongoModel };
