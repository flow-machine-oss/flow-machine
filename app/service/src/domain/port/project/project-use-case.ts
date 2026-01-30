import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { ProjectEntity } from "@/domain/entity/project/project-entity";
import {
  createProjectUseCaseInputSchema,
  deleteProjectUseCaseInputSchema,
  getProjectUseCaseInputSchema,
  listProjectsUseCaseInputSchema,
  updateProjectUseCaseInputSchema,
} from "@/domain/port/project/project-dto";

export const createProjectUseCaseSchema = z.function({
  input: [createProjectUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateProjectUseCase = z.output<typeof createProjectUseCaseSchema>;

export const getProjectUseCaseSchema = z.function({
  input: [getProjectUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(ProjectEntity), z.instanceof(Err)),
  ),
});
export type GetProjectUseCase = z.output<typeof getProjectUseCaseSchema>;

export const listProjectsUseCaseSchema = z.function({
  input: [listProjectsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(ProjectEntity)), z.instanceof(Err)),
  ),
});
export type ListProjectsUseCase = z.output<typeof listProjectsUseCaseSchema>;

export const updateProjectUseCaseSchema = z.function({
  input: [updateProjectUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateProjectUseCase = z.output<typeof updateProjectUseCaseSchema>;

export const deleteProjectUseCaseSchema = z.function({
  input: [deleteProjectUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteProjectUseCase = z.output<typeof deleteProjectUseCaseSchema>;
