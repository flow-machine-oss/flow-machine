import { noop } from "es-toolkit";
import { z } from "zod/v4";
import { credentialHttpResponseDtoSchema } from "@/backend/http-client/credential/credential-http-client-dto";
import { credentialDomainSchema } from "@/domain/entity/credential/credential-domain-schema";

export const credentialDomainCodec = z.codec(
  credentialHttpResponseDtoSchema,
  credentialDomainSchema,
  {
    decode: (dto) => {
      const base = {
        id: dto.id,
        name: dto.name,
        tenant: dto.tenant,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        expiredAt: dto.expiredAt,
      };

      if (dto.type === "apiKey") {
        return { ...base, type: "apiKey" as const, apiKey: dto.apiKey };
      }

      return {
        ...base,
        type: "basic" as const,
        username: dto.username,
        password: dto.password,
      };
    },
    encode: noop as () => never,
  },
);
