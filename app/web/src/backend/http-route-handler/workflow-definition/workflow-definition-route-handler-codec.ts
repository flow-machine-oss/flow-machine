import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { workflowDefinitionHttpResponseDtoSchema } from "@/backend/http-client/workflow-definition/workflow-definition-http-client-dto";
import { workflowDefinitionDomainSchema } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";

export const workflowDefinitionDomainCodec = z.codec(
  workflowDefinitionHttpResponseDtoSchema,
  workflowDefinitionDomainSchema,
  {
    decode: (dto) => ({
      id: dto.id,
      tenant: dto.tenant,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      name: dto.name,
      description: dto.description,
      projectId: dto.projectId,
      actions: dto.actions,
      edges: dto.edges,
      isActive: dto.isActive,
    }),
    encode: noop as () => never,
  },
);
