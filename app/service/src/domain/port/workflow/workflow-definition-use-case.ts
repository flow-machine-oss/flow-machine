import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { WorkflowDefinitionEntity } from "@/domain/entity/workflow/workflow-definition-entity";
import {
  createWorkflowDefinitionUseCaseInputSchema,
  deleteWorkflowDefinitionUseCaseInputSchema,
  getWorkflowDefinitionUseCaseInputSchema,
  listWorkflowDefinitionsUseCaseInputSchema,
  updateWorkflowDefinitionUseCaseInputSchema,
} from "@/domain/port/workflow/workflow-definition-dto";

export const createWorkflowDefinitionUseCaseSchema = z.function({
  input: [createWorkflowDefinitionUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateWorkflowDefinitionUseCase = z.output<
  typeof createWorkflowDefinitionUseCaseSchema
>;

export const getWorkflowDefinitionUseCaseSchema = z.function({
  input: [getWorkflowDefinitionUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(WorkflowDefinitionEntity), z.instanceof(Err)),
  ),
});
export type GetWorkflowDefinitionUseCase = z.output<
  typeof getWorkflowDefinitionUseCaseSchema
>;

export const listWorkflowDefinitionsUseCaseSchema = z.function({
  input: [listWorkflowDefinitionsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(WorkflowDefinitionEntity)),
      z.instanceof(Err),
    ),
  ),
});
export type ListWorkflowDefinitionsUseCase = z.output<
  typeof listWorkflowDefinitionsUseCaseSchema
>;

export const updateWorkflowDefinitionUseCaseSchema = z.function({
  input: [updateWorkflowDefinitionUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateWorkflowDefinitionUseCase = z.output<
  typeof updateWorkflowDefinitionUseCaseSchema
>;

export const deleteWorkflowDefinitionUseCaseSchema = z.function({
  input: [deleteWorkflowDefinitionUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteWorkflowDefinitionUseCase = z.output<
  typeof deleteWorkflowDefinitionUseCaseSchema
>;
