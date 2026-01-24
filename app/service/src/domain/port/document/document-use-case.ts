import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { DocumentEntity } from "@/domain/entity/document/document-entity";
import {
  createDocumentUseCaseInputSchema,
  deleteDocumentUseCaseInputSchema,
  getDocumentUseCaseInputSchema,
  listDocumentsUseCaseInputSchema,
  updateDocumentUseCaseInputSchema,
} from "@/domain/port/document/document-dto";

export const createDocumentUseCaseSchema = z.function({
  input: [createDocumentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateDocumentUseCase = z.output<
  typeof createDocumentUseCaseSchema
>;

export const getDocumentUseCaseSchema = z.function({
  input: [getDocumentUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(DocumentEntity), z.instanceof(Err)),
  ),
});
export type GetDocumentUseCase = z.output<typeof getDocumentUseCaseSchema>;

export const listDocumentsUseCaseSchema = z.function({
  input: [listDocumentsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(DocumentEntity)), z.instanceof(Err)),
  ),
});
export type ListDocumentsUseCase = z.output<typeof listDocumentsUseCaseSchema>;

export const updateDocumentUseCaseSchema = z.function({
  input: [updateDocumentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateDocumentUseCase = z.output<
  typeof updateDocumentUseCaseSchema
>;

export const deleteDocumentUseCaseSchema = z.function({
  input: [deleteDocumentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteDocumentUseCase = z.output<
  typeof deleteDocumentUseCaseSchema
>;
