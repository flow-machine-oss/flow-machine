import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { credentialEntityProps } from "@/domain/entity/credential/credential-entity";

const credentialCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createCredentialUseCaseInputSchema = z.object({
  ctx: credentialCtxSchema,
  payload: credentialEntityProps,
});

export const getCredentialUseCaseInputSchema = z.object({
  ctx: credentialCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listCredentialsUseCaseInputSchema = z.object({
  ctx: credentialCtxSchema,
});

export const credentialUpdateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("apiKey"),
    name: z.string().min(1).max(256).optional(),
    apiKey: z.string().min(1).max(256).optional(),
    expiredAt: z.date().optional(),
  }),
  z.object({
    type: z.literal("basic"),
    name: z.string().min(1).max(256).optional(),
    username: z.string().min(1).max(256).optional(),
    password: z.string().min(1).max(256).optional(),
    expiredAt: z.date().optional(),
  }),
]);

export const updateCredentialUseCaseInputSchema = z.object({
  ctx: credentialCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    data: credentialUpdateSchema,
  }),
});

export const deleteCredentialUseCaseInputSchema = z.object({
  ctx: credentialCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
