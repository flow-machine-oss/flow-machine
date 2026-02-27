import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { stringToDateCodec } from "@/common/schema/codec";

const postCredentialRequestBodyDtoSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    name: z.string().min(1).max(256),
    apiKey: z.string().min(1).max(256),
    expiredAt: stringToDateCodec,
  }),
  z.object({
    type: z.literal("basic"),
    name: z.string().min(1).max(256),
    username: z.string().min(1).max(256),
    password: z.string().min(1).max(256),
    expiredAt: stringToDateCodec,
  }),
]);

const patchCredentialRequestBodyDtoSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    name: z.string().min(1).max(256).optional(),
    apiKey: z.string().min(1).max(256).optional(),
    expiredAt: stringToDateCodec.optional(),
  }),
  z.object({
    type: z.literal("basic"),
    name: z.string().min(1).max(256).optional(),
    username: z.string().min(1).max(256).optional(),
    password: z.string().min(1).max(256).optional(),
    expiredAt: stringToDateCodec.optional(),
  }),
]);

const credentialRequestParamsDtoSchema = z.object({
  id: entityIdSchema,
});

const credentialResponseDtoBaseSchema = z.object({
  id: entityIdSchema,
  name: z.string().min(1).max(256),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  expiredAt: z.date(),
});

const credentialResponseDtoSchema = z.discriminatedUnion("type", [
  credentialResponseDtoBaseSchema.extend({
    type: z.literal("apiKey"),
    apiKey: z.string(),
  }),
  credentialResponseDtoBaseSchema.extend({
    type: z.literal("basic"),
    username: z.string(),
    password: z.string(),
  }),
]);
type CredentialResponseDto = z.output<typeof credentialResponseDtoSchema>;

export {
  postCredentialRequestBodyDtoSchema,
  patchCredentialRequestBodyDtoSchema,
  credentialRequestParamsDtoSchema,
  credentialResponseDtoSchema,
  type CredentialResponseDto,
};
