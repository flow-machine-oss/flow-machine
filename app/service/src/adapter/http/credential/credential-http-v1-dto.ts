import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { stringToDateCodec } from "@/common/schema/codec";

export const postCredentialRequestBodyDtoSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    apiKey: z.string().min(1).max(256),
    expiredAt: stringToDateCodec,
  }),
  z.object({
    type: z.literal("basic"),
    username: z.string().min(1).max(256),
    password: z.string().min(1).max(256),
    expiredAt: stringToDateCodec,
  }),
]);

export const patchCredentialRequestBodyDtoSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("apiKey"),
      apiKey: z.string().min(1).max(256).optional(),
      expiredAt: stringToDateCodec.optional(),
    }),
    z.object({
      type: z.literal("basic"),
      username: z.string().min(1).max(256).optional(),
      password: z.string().min(1).max(256).optional(),
      expiredAt: stringToDateCodec.optional(),
    }),
  ],
);

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const credentialResponseDtoBaseSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  expiredAt: z.date(),
});

export const apiKeyCredentialResponseDtoSchema =
  credentialResponseDtoBaseSchema.extend({
    type: z.literal("apiKey"),
  });

export const basicCredentialResponseDtoSchema =
  credentialResponseDtoBaseSchema.extend({
    type: z.literal("basic"),
    username: z.string(),
  });

export const credentialResponseDtoSchema = z.discriminatedUnion("type", [
  apiKeyCredentialResponseDtoSchema,
  basicCredentialResponseDtoSchema,
]);

export type CredentialResponseDto = z.output<
  typeof credentialResponseDtoSchema
>;
