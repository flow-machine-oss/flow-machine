import type { Result } from "neverthrow";
import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import type { Err } from "@/common/err/err";
import { CredentialEntity } from "@/core/domain/credential/entity";

const ctxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

const credentialCrudRepositoryInputSchema = {
  insert: z.object({
    ctx: ctxSchema,
    data: z.instanceof(CredentialEntity),
  }),

  findOne: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),

  findMany: z.object({
    ctx: ctxSchema,
  }),

  update: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
    data: z.instanceof(CredentialEntity),
  }),

  delete: z.object({
    ctx: ctxSchema,
    id: entityIdSchema,
  }),
};

interface CredentialCrudRepository {
  insert(
    input: z.infer<typeof credentialCrudRepositoryInputSchema.insert>,
  ): Promise<Result<void, Err>>;
  findOne(
    input: z.infer<typeof credentialCrudRepositoryInputSchema.findOne>,
  ): Promise<Result<CredentialEntity | null, Err>>;
  findMany(
    input: z.infer<typeof credentialCrudRepositoryInputSchema.findMany>,
  ): Promise<Result<CredentialEntity[], Err>>;
  update(
    input: z.infer<typeof credentialCrudRepositoryInputSchema.update>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof credentialCrudRepositoryInputSchema.delete>,
  ): Promise<Result<void, Err>>;
}

export { type CredentialCrudRepository, credentialCrudRepositoryInputSchema };
