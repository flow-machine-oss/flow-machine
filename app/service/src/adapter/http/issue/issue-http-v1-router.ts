import Elysia from "elysia";
import {
  idParamsDtoSchema,
  patchIssueRequestBodyDtoSchema,
  postIssueRequestBodyDtoSchema,
} from "@/adapter/http/issue/issue-http-v1-dto";
import type { IssueEntityToResponseDto } from "@/adapter/http/issue/issue-http-v1-dto-mapper";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateIssueUseCase,
  DeleteIssueUseCase,
  GetIssueUseCase,
  ListIssuesUseCase,
  UpdateIssueUseCase,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createIssueUseCase: CreateIssueUseCase;
  deleteIssueUseCase: DeleteIssueUseCase;
  getIssueUseCase: GetIssueUseCase;
  issueEntityToResponseDto: IssueEntityToResponseDto;
  listIssuesUseCase: ListIssuesUseCase;
  updateIssueUseCase: UpdateIssueUseCase;
};

export const makeIssueHttpV1Router = ({
  getSession,
  getActiveMember,
  createIssueUseCase,
  deleteIssueUseCase,
  getIssueUseCase,
  issueEntityToResponseDto,
  listIssuesUseCase,
  updateIssueUseCase,
}: Input) =>
  new Elysia({ name: "issue.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/issue", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createIssueUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postIssueRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listIssuesUseCase({
            ctx: { ...ctx, tenant },
          });
          if (result.isErr()) {
            return errEnvelope(result.error);
          }
          return okEnvelope({
            data: result.value.map((entity) =>
              issueEntityToResponseDto(entity),
            ),
          });
        })
        .get(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await getIssueUseCase({
              ctx: { ...ctx, tenant },
              payload: { id: params.id },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope({
              data: issueEntityToResponseDto(result.value),
            });
          },
          {
            params: idParamsDtoSchema,
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, tenant, params }) => {
            const result = await updateIssueUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                title: body.title,
                description: body.description,
                integration: body.integration,
                projectId: body.projectId,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchIssueRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteIssueUseCase({
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
