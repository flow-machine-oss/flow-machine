import Elysia from "elysia";
import {
  type WorkflowDefinitionResponseDto,
  idParamsDtoSchema,
  patchWorkflowDefinitionRequestBodyDtoSchema,
  postWorkflowDefinitionRequestBodyDtoSchema,
} from "@/adapter/http/workflow-definition/workflow-definition-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { WorkflowDefinitionEntity } from "@/domain/entity/workflow-definition/workflow-definition-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateWorkflowDefinitionUseCase,
  DeleteWorkflowDefinitionUseCase,
  GetWorkflowDefinitionUseCase,
  ListWorkflowDefinitionsUseCase,
  UpdateWorkflowDefinitionUseCase,
} from "@/domain/port/workflow-definition/workflow-definition-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createWorkflowDefinitionUseCase: CreateWorkflowDefinitionUseCase;
  deleteWorkflowDefinitionUseCase: DeleteWorkflowDefinitionUseCase;
  getWorkflowDefinitionUseCase: GetWorkflowDefinitionUseCase;
  listWorkflowDefinitionsUseCase: ListWorkflowDefinitionsUseCase;
  updateWorkflowDefinitionUseCase: UpdateWorkflowDefinitionUseCase;
};

const toResponseDto = (
  entity: WorkflowDefinitionEntity,
): WorkflowDefinitionResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenant: entity.tenant,
  name: entity.props.name,
  description: entity.props.description,
  projectId: entity.props.projectId,
  actions: entity.props.actions,
  edges: entity.props.edges,
  isActive: entity.props.isActive,
});

export const makeWorkflowDefinitionHttpV1Router = ({
  getSession,
  getActiveMember,
  createWorkflowDefinitionUseCase,
  deleteWorkflowDefinitionUseCase,
  getWorkflowDefinitionUseCase,
  listWorkflowDefinitionsUseCase,
  updateWorkflowDefinitionUseCase,
}: Input) =>
  new Elysia({ name: "workflow-definition.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/workflow-definition", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createWorkflowDefinitionUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postWorkflowDefinitionRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listWorkflowDefinitionsUseCase({
            ctx: { ...ctx, tenant },
          });
          if (result.isErr()) {
            return errEnvelope(result.error);
          }
          return okEnvelope({ data: result.value.map(toResponseDto) });
        })
        .get(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await getWorkflowDefinitionUseCase({
              ctx: { ...ctx, tenant },
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
          async ({ body, ctx, tenant, params }) => {
            const result = await updateWorkflowDefinitionUseCase({
              ctx: { ...ctx, tenant },
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
            body: patchWorkflowDefinitionRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteWorkflowDefinitionUseCase({
              ctx: { ...ctx, tenant },
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
