import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { gitRepositoryHttpResponseDtoSchema } from "@/backend/http-client/git-repository/git-repository-http-client-dto";
import { gitRepositoryDomainSchema } from "@/domain/entity/git-repository/git-repository-domain-schema";

export const gitRepositoryHttpResponseDtoToDomainCodec = z.codec(
  gitRepositoryHttpResponseDtoSchema,
  gitRepositoryDomainSchema,
  {
    decode: (dto) => ({
      id: dto.id,
      tenant: dto.tenant,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      name: dto.name,
      url: dto.url,
      config: dto.config,
      integration: dto.integration,
    }),
    encode: noop as () => never,
  },
);
