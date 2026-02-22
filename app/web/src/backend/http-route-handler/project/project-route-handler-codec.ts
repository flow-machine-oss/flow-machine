import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { projectHttpResponseDtoSchema } from "@/backend/http-client/project/project-http-client-dto";
import { projectDomainSchema } from "@/domain/entity/project/project-domain-schema";

export const projectDomainCodec = z.codec(
  projectHttpResponseDtoSchema,
  projectDomainSchema,
  {
    decode: (dto) => ({
      id: dto.id,
      tenant: dto.tenant,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      name: dto.name,
      integration: dto.integration,
    }),
    encode: noop as () => never,
  },
);
