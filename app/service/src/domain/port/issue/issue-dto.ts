import z from "zod";
import { mongoCtxSchema } from "@/common/ctx/mongo-ctx";
import { tenantCtxSchema } from "@/common/ctx/tenant-ctx";
import { entityIdSchema } from "@/common/domain/entity-id";
import { issueEntityProps } from "@/domain/entity/issue/issue-entity";

const issueCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});

export const createIssueUseCaseInputSchema = z.object({
  ctx: issueCtxSchema,
  payload: z.object({
    title: issueEntityProps.shape.title,
    description: issueEntityProps.shape.description,
    integration: issueEntityProps.shape.integration,
    projectId: issueEntityProps.shape.projectId,
  }),
});

export const getIssueUseCaseInputSchema = z.object({
  ctx: issueCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});

export const listIssuesUseCaseInputSchema = z.object({
  ctx: issueCtxSchema,
});

export const updateIssueUseCaseInputSchema = z.object({
  ctx: issueCtxSchema,
  payload: z.object({
    id: entityIdSchema,
    title: issueEntityProps.shape.title.optional(),
    description: issueEntityProps.shape.description.optional(),
    integration: issueEntityProps.shape.integration.optional(),
    projectId: issueEntityProps.shape.projectId.optional(),
  }),
});

export const deleteIssueUseCaseInputSchema = z.object({
  ctx: issueCtxSchema,
  payload: z.object({
    id: entityIdSchema,
  }),
});
