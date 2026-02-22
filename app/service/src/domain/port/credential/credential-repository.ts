import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import { credentialUpdateSchema } from "@/domain/port/credential/credential-dto";

const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertCredentialRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      data: z.instanceof(CredentialEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertCredentialRepository = z.output<
  typeof insertCredentialRepositorySchema
>;

export const findCredentialByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(CredentialEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindCredentialByIdRepository = z.output<
  typeof findCredentialByIdRepositorySchema
>;

export const findCredentialsRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(CredentialEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type FindCredentialsRepository = z.output<
  typeof findCredentialsRepositorySchema
>;

export const updateCredentialRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
      data: credentialUpdateSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateCredentialRepository = z.output<
  typeof updateCredentialRepositorySchema
>;

export const deleteCredentialRepositorySchema = z.function({
  input: [
    z.object({
      ctx: repositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteCredentialRepository = z.output<
  typeof deleteCredentialRepositorySchema
>;
