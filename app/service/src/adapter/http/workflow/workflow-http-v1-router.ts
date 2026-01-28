import Elysia from "elysia";
import {
  type WorkflowResponseDto,
  idParamsDtoSchema,
  patchWorkflowRequestBodyDtoSchema,
  postWorkflowRequestBodyDtoSchema,
} from "@/adapter/http/workflow/workflow-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { WorkflowEntity } from "@/domain/entity/workflow/workflow-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateWorkflowUseCase,
  DeleteWorkflowUseCase,
  GetWorkflowUseCase,
  ListWorkflowsUseCase,
  UpdateWorkflowUseCase,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createWorkflowUseCase: CreateWorkflowUseCase;
  deleteWorkflowUseCase: DeleteWorkflowUseCase;
  getWorkflowUseCase: GetWorkflowUseCase;
  listWorkflowsUseCase: ListWorkflowsUseCase;
  updateWorkflowUseCase: UpdateWorkflowUseCase;
};

const toResponseDto = (entity: WorkflowEntity): WorkflowResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenantId: entity.tenantId,
  name: entity.props.name,
  description: entity.props.description,
  projectId: entity.props.projectId,
  actions: entity.props.actions,
  edges: entity.props.edges,
  isActive: entity.props.isActive,
});

export const makeWorkflowHttpV1Router = ({
  getSession,
  getActiveMember,
  createWorkflowUseCase,
  deleteWorkflowUseCase,
  getWorkflowUseCase,
  listWorkflowsUseCase,
  updateWorkflowUseCase,
}: Input) =>
  new Elysia({ name: "workflow.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/workflow", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, organizationId }) => {
            const result = await createWorkflowUseCase({
              ctx: { ...ctx, tenantId: organizationId },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postWorkflowRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, organizationId }) => {
          const result = await listWorkflowsUseCase({
            ctx: { ...ctx, tenantId: organizationId },
          });
          if (result.isErr()) {
            return errEnvelope(result.error);
          }
          return okEnvelope({ data: result.value.map(toResponseDto) });
        })
        .get(
          "/:id",
          async ({ ctx, organizationId, params }) => {
            const result = await getWorkflowUseCase({
              ctx: { ...ctx, tenantId: organizationId },
              payload: { id: params.id },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope({ data: toResponseDto(result.value) });
          },
          {
            params: idParamsDtoSchema,
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, organizationId, params }) => {
            const result = await updateWorkflowUseCase({
              ctx: { ...ctx, tenantId: organizationId },
              payload: {
                id: params.id,
                name: body.name,
                description: body.description,
                projectId: body.projectId,
                actions: body.actions,
                edges: body.edges,
                isActive: body.isActive,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchWorkflowRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, organizationId, params }) => {
            const result = await deleteWorkflowUseCase({
              ctx: { ...ctx, tenantId: organizationId },
              payload: { id: params.id },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            params: idParamsDtoSchema,
          },
        ),
    );
