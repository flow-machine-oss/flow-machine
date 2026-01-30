import Elysia from "elysia";
import {
  type DocumentResponseDto,
  idParamsDtoSchema,
  patchDocumentRequestBodyDtoSchema,
  postDocumentRequestBodyDtoSchema,
} from "@/adapter/http/document/document-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { DocumentEntity } from "@/domain/entity/document/document-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateDocumentUseCase,
  DeleteDocumentUseCase,
  GetDocumentUseCase,
  ListDocumentsUseCase,
  UpdateDocumentUseCase,
} from "@/domain/port/document/document-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createDocumentUseCase: CreateDocumentUseCase;
  deleteDocumentUseCase: DeleteDocumentUseCase;
  getDocumentUseCase: GetDocumentUseCase;
  listDocumentsUseCase: ListDocumentsUseCase;
  updateDocumentUseCase: UpdateDocumentUseCase;
};

const toResponseDto = (entity: DocumentEntity): DocumentResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenant: entity.tenant,
  content: entity.props.content,
  projectId: entity.props.projectId,
  title: entity.props.title,
});

export const makeDocumentHttpV1Router = ({
  getSession,
  getActiveMember,
  createDocumentUseCase,
  deleteDocumentUseCase,
  getDocumentUseCase,
  listDocumentsUseCase,
  updateDocumentUseCase,
}: Input) =>
  new Elysia({ name: "document.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/document", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createDocumentUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postDocumentRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listDocumentsUseCase({
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
            const result = await getDocumentUseCase({
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
            const result = await updateDocumentUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                content: body.content,
                projectId: body.projectId,
                title: body.title,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchDocumentRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteDocumentUseCase({
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
