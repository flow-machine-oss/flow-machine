import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";

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
