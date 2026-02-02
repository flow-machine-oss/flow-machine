import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import {
  IssueEntity,
  issueEntityProps,
} from "@/domain/entity/issue/issue-entity";

const issueRepositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const insertIssueRepositorySchema = z.function({
  input: [
    z.object({
      ctx: issueRepositoryCtxSchema,
      data: z.instanceof(IssueEntity),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertIssueRepository = z.output<typeof insertIssueRepositorySchema>;

export const findIssueByIdRepositorySchema = z.function({
  input: [
    z.object({
      ctx: issueRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(IssueEntity).nullable(),
      z.instanceof(Err),
    ),
  ),
});
export type FindIssueByIdRepository = z.output<
  typeof findIssueByIdRepositorySchema
>;

export const findIssuesRepositorySchema = z.function({
  input: [
    z.object({
      ctx: issueRepositoryCtxSchema,
    }),
  ],
  output: z.promise(
    makeResultSchema(
      z.instanceof(IssueEntity).array(),
      z.instanceof(Err),
    ),
  ),
});
export type FindIssuesRepository = z.output<typeof findIssuesRepositorySchema>;

export const updateIssueRepositorySchema = z.function({
  input: [
    z.object({
      ctx: issueRepositoryCtxSchema,
      id: entityIdSchema,
      data: z.object({
        title: issueEntityProps.shape.title.optional(),
        description: issueEntityProps.shape.description.optional(),
        integration: issueEntityProps.shape.integration.optional(),
        projectId: issueEntityProps.shape.projectId.optional(),
      }),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateIssueRepository = z.output<typeof updateIssueRepositorySchema>;

export const deleteIssueRepositorySchema = z.function({
  input: [
    z.object({
      ctx: issueRepositoryCtxSchema,
      id: entityIdSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});

export type DeleteIssueRepository = z.output<typeof deleteIssueRepositorySchema>;
