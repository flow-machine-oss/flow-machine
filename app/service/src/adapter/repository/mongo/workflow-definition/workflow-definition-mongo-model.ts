import z from "zod";
import { baseTenantAwareMongoModelSchema } from "@/common/mongo/mongo-model";
import { workflowDefinitionEntityProps } from "@/domain/entity/workflow/workflow-definition-entity";

export const workflowDefinitionMongoModelSchema = z.object({
  ...baseTenantAwareMongoModelSchema.shape,
  ...workflowDefinitionEntityProps.shape,
});
export type WorkflowDefinitionMongoModel = z.infer<
  typeof workflowDefinitionMongoModelSchema
>;
