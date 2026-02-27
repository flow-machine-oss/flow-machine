import z from "zod";
import { entityIdSchema } from "@/core/domain/entity";

const workflowActionDefinitionResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  kind: z.string(),
  name: z.string(),
});
type WorkflowActionDefinitionResponseDto = z.output<
  typeof workflowActionDefinitionResponseDtoSchema
>;

export {
  workflowActionDefinitionResponseDtoSchema,
  type WorkflowActionDefinitionResponseDto,
};
