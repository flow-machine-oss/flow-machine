import z from "zod";
import { workflowDefinitionMongoModelSchema } from "@/adapter/repository/workflow/definition/mongo/workflow-definition-mongo-model";
import { WorkflowDefinitionEntity } from "@/domain/entity/workflow/workflow-definition-entity";

export const workflowDefinitionMongoModelToEntitySchema = z.function({
  input: [workflowDefinitionMongoModelSchema],
  output: z.instanceof(WorkflowDefinitionEntity),
});
export type WorkflowDefinitionMongoModelToEntity = z.infer<
  typeof workflowDefinitionMongoModelToEntitySchema
>;

export const workflowDefinitionMongoModelToEntity =
  workflowDefinitionMongoModelToEntitySchema.implement((model) => {
    return WorkflowDefinitionEntity.makeExisting(
      model._id,
      model.createdAt,
      model.updatedAt,
      model.tenant,
      {
        name: model.name,
        description: model.description,
        projectId: model.projectId,
        actions: model.actions,
        edges: model.edges,
        isActive: model.isActive,
      },
    );
  });

export const workflowDefinitionEntityToMongoModelSchema = z.function({
  input: [z.instanceof(WorkflowDefinitionEntity)],
  output: workflowDefinitionMongoModelSchema,
});
export type WorkflowDefinitionEntityToMongoModel = z.infer<
  typeof workflowDefinitionEntityToMongoModelSchema
>;

export const workflowDefinitionEntityToMongoModel =
  workflowDefinitionEntityToMongoModelSchema.implement((entity) => {
    return {
      _id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      name: entity.props.name,
      description: entity.props.description,
      projectId: entity.props.projectId,
      actions: entity.props.actions,
      edges: entity.props.edges,
      isActive: entity.props.isActive,
    };
  });
