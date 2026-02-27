import Elysia from "elysia";
import { errEnvelope, okEnvelope } from "@/api/http-envelope";
import {
  type DocumentResponseDto,
  patchDocumentRequestBodyDtoSchema,
  patchDocumentRequestParamsDtoSchema,
  postDocumentRequestBodyDtoSchema,
} from "@/api/module/document/v1/http-dto";
import type { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import type { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import type { DocumentCrudService } from "@/core/domain/document/crud-service";
import type { DocumentEntity } from "@/core/domain/document/entity";

export class DocumentV1HttpRouterFactory {
  #httpAuthGuardFactory: HttpAuthGuardFactory;
  #httpRequestCtxFactory: HttpRequestCtxFactory;
  #documentCrudService: DocumentCrudService;

  constructor(
    httpAuthGuardFactory: HttpAuthGuardFactory,
    httpRequestCtxFactory: HttpRequestCtxFactory,
    documentCrudService: DocumentCrudService,
  ) {
    this.#httpAuthGuardFactory = httpAuthGuardFactory;
    this.#httpRequestCtxFactory = httpRequestCtxFactory;
    this.#documentCrudService = documentCrudService;
  }

  make() {
    return new Elysia({ name: DocumentV1HttpRouterFactory.name })
      .use(this.#httpRequestCtxFactory.make())
      .use(this.#httpAuthGuardFactory.make())
      .group("/api/v1/document", (r) =>
        r
          .post(
            "",
            async ({ body, ctx, tenant }) => {
              const result = await this.#documentCrudService.create({
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
            const result = await this.#documentCrudService.list({
              ctx: { ...ctx, tenant },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope({
              data: result.value.map(this.#toDto),
            });
          })
          .get(
            "/:id",
            async ({ ctx, tenant, params }) => {
              const result = await this.#documentCrudService.get({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope({ data: this.#toDto(result.value) });
            },
            {
              params: patchDocumentRequestParamsDtoSchema,
            },
          )
          .patch(
            "/:id",
            async ({ body, ctx, tenant, params }) => {
              const result = await this.#documentCrudService.update({
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
              params: patchDocumentRequestParamsDtoSchema,
            },
          )
          .delete(
            "/:id",
            async ({ ctx, tenant, params }) => {
              const result = await this.#documentCrudService.delete({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              params: patchDocumentRequestParamsDtoSchema,
            },
          ),
      );
  }

  #toDto(entity: DocumentEntity) {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      content: entity.props.content,
      projectId: entity.props.projectId,
      title: entity.props.title,
    } as const satisfies DocumentResponseDto;
  }
}
