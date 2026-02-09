import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { workflowActionDefinitionHttpResponseDtoSchema } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client-dto";
import { workflowActionDefinitionDomainSchema } from "@/domain/entity/workflow-action-definition/workflow-action-definition-schema";

export const workflowActionDefinitionHttpResponseDtoToDomainCodec = z.codec(
  workflowActionDefinitionHttpResponseDtoSchema,
  workflowActionDefinitionDomainSchema,
  {
    decode: (dto) => ({
      id: dto.id,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      kind: dto.kind,
      name: dto.name,
    }),
    encode: noop as () => never,
  },
);
