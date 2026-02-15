import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { aiAgentHttpResponseDtoSchema } from "@/backend/http-client/ai-agent/ai-agent-http-client-dto";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";

export const aiAgentDomainCodec = z.codec(
  aiAgentHttpResponseDtoSchema,
  aiAgentDomainSchema,
  {
    decode: (dto) => ({
      id: dto.id,
      tenant: dto.tenant,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      model: dto.model,
      name: dto.name,
    }),
    encode: noop as () => never,
  },
);
