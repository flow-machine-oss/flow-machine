import z from "zod";
import { gitRepositoryMongoModelSchema } from "@/adapter/repository/mongo/git-repository/git-repository-mongo-model";
import { GitRepositoryEntity } from "@/domain/entity/git-repository/git-repository-entity";

export const gitRepositoryMongoModelToEntitySchema = z.function({
  input: [gitRepositoryMongoModelSchema],
  output: z.instanceof(GitRepositoryEntity),
});
export type GitRepositoryMongoModelToEntity = z.infer<
  typeof gitRepositoryMongoModelToEntitySchema
>;

export const gitRepositoryMongoModelToEntity =
  gitRepositoryMongoModelToEntitySchema.implement((model) => {
    return GitRepositoryEntity.makeExisting(
      model._id,
      model.createdAt,
      model.updatedAt,
      model.tenant,
      {
        name: model.name,
        url: model.url,
        config: model.config,
        integration: model.integration,
      },
    );
  });

export const gitRepositoryEntityToMongoModelSchema = z.function({
  input: [z.instanceof(GitRepositoryEntity)],
  output: gitRepositoryMongoModelSchema,
});
export type GitRepositoryEntityToMongoModel = z.infer<
  typeof gitRepositoryEntityToMongoModelSchema
>;

export const gitRepositoryEntityToMongoModel =
  gitRepositoryEntityToMongoModelSchema.implement((entity) => {
    return {
      _id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      name: entity.props.name,
      url: entity.props.url,
      config: entity.props.config,
      integration: entity.props.integration,
    };
  });
