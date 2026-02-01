import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { GitRepositoryEntity } from "@/domain/entity/git-repository/git-repository-entity";
import {
  createGitRepositoryUseCaseInputSchema,
  deleteGitRepositoryUseCaseInputSchema,
  getGitRepositoryUseCaseInputSchema,
  listGitRepositoriesUseCaseInputSchema,
  updateGitRepositoryUseCaseInputSchema,
} from "@/domain/port/git-repository/git-repository-dto";

export const createGitRepositoryUseCaseSchema = z.function({
  input: [createGitRepositoryUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateGitRepositoryUseCase = z.output<
  typeof createGitRepositoryUseCaseSchema
>;

export const getGitRepositoryUseCaseSchema = z.function({
  input: [getGitRepositoryUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(GitRepositoryEntity), z.instanceof(Err)),
  ),
});
export type GetGitRepositoryUseCase = z.output<
  typeof getGitRepositoryUseCaseSchema
>;

export const listGitRepositoriesUseCaseSchema = z.function({
  input: [listGitRepositoriesUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(GitRepositoryEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type ListGitRepositoriesUseCase = z.output<
  typeof listGitRepositoriesUseCaseSchema
>;

export const updateGitRepositoryUseCaseSchema = z.function({
  input: [updateGitRepositoryUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateGitRepositoryUseCase = z.output<
  typeof updateGitRepositoryUseCaseSchema
>;

export const deleteGitRepositoryUseCaseSchema = z.function({
  input: [deleteGitRepositoryUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteGitRepositoryUseCase = z.output<
  typeof deleteGitRepositoryUseCaseSchema
>;
