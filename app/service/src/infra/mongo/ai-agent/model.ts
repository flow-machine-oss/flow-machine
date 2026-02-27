import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { AiAgentEntityProps } from "@/core/domain/ai-agent/entity";

type AiAgentMongoModel = TenantAwareMongoModel<AiAgentEntityProps>;

export type { AiAgentMongoModel };
