import z from "zod";
import { issueResponseDtoSchema } from "@/adapter/http/issue/issue-http-v1-dto";
import { IssueEntity } from "@/domain/entity/issue/issue-entity";

export const issueEntityToResponseDtoSchema = z.function({
  input: [z.instanceof(IssueEntity)],
  output: issueResponseDtoSchema,
});
export type IssueEntityToResponseDto = z.infer<
  typeof issueEntityToResponseDtoSchema
>;

export const issueEntityToResponseDto =
  issueEntityToResponseDtoSchema.implement((entity) => ({
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    tenant: entity.tenant,

    title: entity.props.title,
    description: entity.props.description,
    integration: entity.props.integration,
    projectId: entity.props.projectId,
  }));
