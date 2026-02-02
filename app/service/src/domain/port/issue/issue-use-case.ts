import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { IssueEntity } from "@/domain/entity/issue/issue-entity";
import {
  createIssueUseCaseInputSchema,
  deleteIssueUseCaseInputSchema,
  getIssueUseCaseInputSchema,
  listIssuesUseCaseInputSchema,
  updateIssueUseCaseInputSchema,
} from "@/domain/port/issue/issue-dto";

export const createIssueUseCaseSchema = z.function({
  input: [createIssueUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateIssueUseCase = z.output<typeof createIssueUseCaseSchema>;

export const getIssueUseCaseSchema = z.function({
  input: [getIssueUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(IssueEntity), z.instanceof(Err)),
  ),
});
export type GetIssueUseCase = z.output<typeof getIssueUseCaseSchema>;

export const listIssuesUseCaseSchema = z.function({
  input: [listIssuesUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(IssueEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type ListIssuesUseCase = z.output<typeof listIssuesUseCaseSchema>;

export const updateIssueUseCaseSchema = z.function({
  input: [updateIssueUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateIssueUseCase = z.output<typeof updateIssueUseCaseSchema>;

export const deleteIssueUseCaseSchema = z.function({
  input: [deleteIssueUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteIssueUseCase = z.output<typeof deleteIssueUseCaseSchema>;
