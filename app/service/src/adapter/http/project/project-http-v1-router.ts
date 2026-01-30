import Elysia from "elysia";
import {
  type ProjectResponseDto,
  idParamsDtoSchema,
  patchProjectRequestBodyDtoSchema,
  postProjectRequestBodyDtoSchema,
} from "@/adapter/http/project/project-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { ProjectEntity } from "@/domain/entity/project/project-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectUseCase,
  ListProjectsUseCase,
  UpdateProjectUseCase,
} from "@/domain/port/project/project-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createProjectUseCase: CreateProjectUseCase;
  deleteProjectUseCase: DeleteProjectUseCase;
  getProjectUseCase: GetProjectUseCase;
  listProjectsUseCase: ListProjectsUseCase;
  updateProjectUseCase: UpdateProjectUseCase;
};

const toResponseDto = (entity: ProjectEntity): ProjectResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenant: entity.tenant,
  name: entity.props.name,
});

export const makeProjectHttpV1Router = ({
  getSession,
  getActiveMember,
  createProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase,
  listProjectsUseCase,
  updateProjectUseCase,
}: Input) =>
  new Elysia({ name: "project.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/project", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createProjectUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postProjectRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listProjectsUseCase({
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
            const result = await getProjectUseCase({
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
            const result = await updateProjectUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                name: body.name,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchProjectRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteProjectUseCase({
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
