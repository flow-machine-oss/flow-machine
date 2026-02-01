import Elysia from "elysia";
import {
  type GitRepositoryResponseDto,
  idParamsDtoSchema,
  patchGitRepositoryRequestBodyDtoSchema,
  postGitRepositoryRequestBodyDtoSchema,
} from "@/adapter/http/git-repository/git-repository-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { GitRepositoryEntity } from "@/domain/entity/git-repository/git-repository-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateGitRepositoryUseCase,
  DeleteGitRepositoryUseCase,
  GetGitRepositoryUseCase,
  ListGitRepositoriesUseCase,
  UpdateGitRepositoryUseCase,
} from "@/domain/port/git-repository/git-repository-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createGitRepositoryUseCase: CreateGitRepositoryUseCase;
  deleteGitRepositoryUseCase: DeleteGitRepositoryUseCase;
  getGitRepositoryUseCase: GetGitRepositoryUseCase;
  listGitRepositoriesUseCase: ListGitRepositoriesUseCase;
  updateGitRepositoryUseCase: UpdateGitRepositoryUseCase;
};

const toResponseDto = (
  entity: GitRepositoryEntity,
): GitRepositoryResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenant: entity.tenant,
  name: entity.props.name,
  url: entity.props.url,
  config: entity.props.config,
  integration: entity.props.integration,
});

export const makeGitRepositoryHttpV1Router = ({
  getSession,
  getActiveMember,
  createGitRepositoryUseCase,
  deleteGitRepositoryUseCase,
  getGitRepositoryUseCase,
  listGitRepositoriesUseCase,
  updateGitRepositoryUseCase,
}: Input) =>
  new Elysia({ name: "git-repository.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/git-repository", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createGitRepositoryUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postGitRepositoryRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listGitRepositoriesUseCase({
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
            const result = await getGitRepositoryUseCase({
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
            const result = await updateGitRepositoryUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                name: body.name,
                url: body.url,
                config: body.config,
                integration: body.integration,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchGitRepositoryRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteGitRepositoryUseCase({
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
