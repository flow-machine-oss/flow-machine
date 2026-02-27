import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import {
  type CredentialEntity,
  credentialEntityProps,
} from "@/v2/core/domain/credential/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const credentialUpdateSchema = z.discriminatedUnion("type", [
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

const credentialCrudServiceInputSchema = {
  create: z.object({
    ctx: ctxSchema,
    payload: credentialEntityProps,
  }),

  get: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
    }),
  }),

  list: z.object({
    ctx: ctxSchema,
  }),

  update: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
      data: credentialUpdateSchema,
    }),
  }),

  delete: z.object({
    ctx: ctxSchema,
    payload: z.object({
      id: entityIdSchema,
    }),
  }),
};

interface CredentialCrudService {
  create(
    input: z.infer<typeof credentialCrudServiceInputSchema.create>,
  ): Promise<Result<void, Err>>;
  get(
    input: z.infer<typeof credentialCrudServiceInputSchema.get>,
  ): Promise<Result<CredentialEntity, Err>>;
  list(
    input: z.infer<typeof credentialCrudServiceInputSchema.list>,
  ): Promise<Result<CredentialEntity[], Err>>;
  update(
    input: z.infer<typeof credentialCrudServiceInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof credentialCrudServiceInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export {
  type CredentialCrudService,
  credentialCrudServiceInputSchema,
  credentialUpdateSchema,
};
