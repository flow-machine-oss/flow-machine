import z from "zod";
import { gitRepositoryResponseDtoSchema } from "@/adapter/http/git-repository/git-repository-http-v1-dto";
import { GitRepositoryEntity } from "@/domain/entity/git-repository/git-repository-entity";

export const gitRepositoryEntityToResponseDtoSchema = z.function({
  input: [z.instanceof(GitRepositoryEntity)],
  output: gitRepositoryResponseDtoSchema,
});
export type GitRepositoryEntityToResponseDto = z.infer<
  typeof gitRepositoryEntityToResponseDtoSchema
>;

export const gitRepositoryEntityToResponseDto =
  gitRepositoryEntityToResponseDtoSchema.implement((entity) => ({
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    tenant: entity.tenant,

    name: entity.props.name,
    url: entity.props.url,
    config: entity.props.config,
    integration: entity.props.integration,
  }));
