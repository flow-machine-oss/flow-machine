import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";
import { issueEntityProps } from "@/domain/entity/issue/issue-entity";
import { createIssueUseCaseInputSchema } from "@/domain/port/issue/issue-dto";

export const postIssueRequestBodyDtoSchema = z.object({
  title: createIssueUseCaseInputSchema.shape.payload.shape.title,
  description: createIssueUseCaseInputSchema.shape.payload.shape.description,
  integration: createIssueUseCaseInputSchema.shape.payload.shape.integration,
  projectId: createIssueUseCaseInputSchema.shape.payload.shape.projectId,
});

export const patchIssueRequestBodyDtoSchema = z.object({
  title: issueEntityProps.shape.title.optional(),
  description: issueEntityProps.shape.description.optional(),
  integration: issueEntityProps.shape.integration.optional(),
  projectId: issueEntityProps.shape.projectId.optional(),
});

export const idParamsDtoSchema = z.object({
  id: entityIdSchema,
});

export const issueResponseDtoSchema = z.object({
  id: entityIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  tenant: tenantSchema,
  title: issueEntityProps.shape.title,
  description: issueEntityProps.shape.description,
  integration: issueEntityProps.shape.integration,
  projectId: issueEntityProps.shape.projectId,
});

export type IssueResponseDto = z.output<typeof issueResponseDtoSchema>;
