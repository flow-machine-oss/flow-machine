import z from "zod";
import { issueMongoModelSchema } from "@/adapter/repository/mongo/issue/issue-mongo-model";
import { IssueEntity } from "@/domain/entity/issue/issue-entity";

export const issueMongoModelToEntitySchema = z.function({
  input: [issueMongoModelSchema],
  output: z.instanceof(IssueEntity),
});
export type IssueMongoModelToEntity = z.infer<
  typeof issueMongoModelToEntitySchema
>;

export const issueMongoModelToEntity =
  issueMongoModelToEntitySchema.implement((model) => {
    return IssueEntity.makeExisting(
      model._id,
      model.createdAt,
      model.updatedAt,
      model.tenant,
      {
        title: model.title,
        description: model.description,
        integration: model.integration,
        projectId: model.projectId,
      },
    );
  });

export const issueEntityToMongoModelSchema = z.function({
  input: [z.instanceof(IssueEntity)],
  output: issueMongoModelSchema,
});
export type IssueEntityToMongoModel = z.infer<
  typeof issueEntityToMongoModelSchema
>;

export const issueEntityToMongoModel =
  issueEntityToMongoModelSchema.implement((entity) => {
    return {
      _id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      title: entity.props.title,
      description: entity.props.description,
      integration: entity.props.integration,
      projectId: entity.props.projectId,
    };
  });
