import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { workflowActionDefinitionEntityProps } from "@/domain/entity/workflow/workflow-action-definition-entity";

export const workflowActionDefinitionResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  kind: workflowActionDefinitionEntityProps.shape.kind,
  name: workflowActionDefinitionEntityProps.shape.name,
});

export type WorkflowActionDefinitionResponseDto = z.output<
  typeof workflowActionDefinitionResponseDtoSchema
>;
