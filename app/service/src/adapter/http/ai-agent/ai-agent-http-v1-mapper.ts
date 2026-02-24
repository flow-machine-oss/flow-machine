import z from "zod";
import { aiAgentResponseDtoSchema } from "@/adapter/http/ai-agent/ai-agent-http-v1-dto";
import { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";

export const aiAgentEntityToResponseDtoSchema = z.function({
  input: [z.instanceof(AiAgentEntity)],
  output: aiAgentResponseDtoSchema,
});
export type AiAgentEntityToResponseDto = z.infer<
  typeof aiAgentEntityToResponseDtoSchema
>;

export const aiAgentEntityToResponseDto =
  aiAgentEntityToResponseDtoSchema.implement((entity) => ({
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    tenant: entity.tenant,

    name: entity.props.name,
    model: entity.props.model,
  }));
