import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import {
  createCredentialUseCaseInputSchema,
  deleteCredentialUseCaseInputSchema,
  getCredentialUseCaseInputSchema,
  listCredentialsUseCaseInputSchema,
  updateCredentialUseCaseInputSchema,
} from "@/domain/port/credential/credential-dto";

export const createCredentialUseCaseSchema = z.function({
  input: [createCredentialUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateCredentialUseCase = z.output<
  typeof createCredentialUseCaseSchema
>;

export const getCredentialUseCaseSchema = z.function({
  input: [getCredentialUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(CredentialEntity), z.instanceof(Err)),
  ),
});
export type GetCredentialUseCase = z.output<typeof getCredentialUseCaseSchema>;

export const listCredentialsUseCaseSchema = z.function({
  input: [listCredentialsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(CredentialEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type ListCredentialsUseCase = z.output<
  typeof listCredentialsUseCaseSchema
>;

export const updateCredentialUseCaseSchema = z.function({
  input: [updateCredentialUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateCredentialUseCase = z.output<
  typeof updateCredentialUseCaseSchema
>;

export const deleteCredentialUseCaseSchema = z.function({
  input: [deleteCredentialUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteCredentialUseCase = z.output<
  typeof deleteCredentialUseCaseSchema
>;
