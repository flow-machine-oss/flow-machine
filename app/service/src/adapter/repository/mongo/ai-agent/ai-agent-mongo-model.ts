import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { AiAgentEntityProps } from "@/domain/entity/ai-agent/ai-agent-entity";

export type AiAgentMongoModel = TenantAwareMongoModel<AiAgentEntityProps>;
