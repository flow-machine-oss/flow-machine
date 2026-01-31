import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { WorkflowActionDefinitionEntity } from "@/domain/entity/workflow/workflow-action-definition-entity";
import { listWorkflowActionDefinitionsUseCaseInputSchema } from "@/domain/port/workflow/workflow-action-definition-dto";

export const listWorkflowActionDefinitionsUseCaseSchema = z.function({
  input: [listWorkflowActionDefinitionsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(
      z.array(z.instanceof(WorkflowActionDefinitionEntity)),
      z.instanceof(Err),
    ),
  ),
});

export type ListWorkflowActionDefinitionsUseCase = z.output<
  typeof listWorkflowActionDefinitionsUseCaseSchema
>;
