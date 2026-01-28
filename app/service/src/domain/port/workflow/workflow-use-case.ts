import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { WorkflowEntity } from "@/domain/entity/workflow/workflow-entity";
import {
  createWorkflowUseCaseInputSchema,
  deleteWorkflowUseCaseInputSchema,
  getWorkflowUseCaseInputSchema,
  listWorkflowsUseCaseInputSchema,
  updateWorkflowUseCaseInputSchema,
} from "@/domain/port/workflow/workflow-dto";

export const createWorkflowUseCaseSchema = z.function({
  input: [createWorkflowUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateWorkflowUseCase = z.output<
  typeof createWorkflowUseCaseSchema
>;

export const getWorkflowUseCaseSchema = z.function({
  input: [getWorkflowUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(WorkflowEntity), z.instanceof(Err)),
  ),
});
export type GetWorkflowUseCase = z.output<typeof getWorkflowUseCaseSchema>;

export const listWorkflowsUseCaseSchema = z.function({
  input: [listWorkflowsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(WorkflowEntity)), z.instanceof(Err)),
  ),
});
export type ListWorkflowsUseCase = z.output<typeof listWorkflowsUseCaseSchema>;

export const updateWorkflowUseCaseSchema = z.function({
  input: [updateWorkflowUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateWorkflowUseCase = z.output<
  typeof updateWorkflowUseCaseSchema
>;

export const deleteWorkflowUseCaseSchema = z.function({
  input: [deleteWorkflowUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteWorkflowUseCase = z.output<
  typeof deleteWorkflowUseCaseSchema
>;
