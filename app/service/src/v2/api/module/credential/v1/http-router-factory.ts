import Elysia from "elysia";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import {
  type CredentialResponseDto,
  credentialRequestParamsDtoSchema,
  patchCredentialRequestBodyDtoSchema,
  postCredentialRequestBodyDtoSchema,
} from "@/v2/api/module/credential/v1/http-dto";
import type { HttpAuthGuardFactory } from "@/v2/api/plugin/http-auth-guard-factory";
import type { HttpRequestCtxFactory } from "@/v2/api/plugin/http-request-ctx-factory";
import type { CredentialCrudService } from "@/v2/core/domain/credential/crud-service";
import type { CredentialEntity } from "@/v2/core/domain/credential/entity";

export class CredentialV1HttpRouterFactory {
  #httpAuthGuardFactory: HttpAuthGuardFactory;
  #httpRequestCtxFactory: HttpRequestCtxFactory;
  #credentialCrudService: CredentialCrudService;

  constructor(
    httpAuthGuardFactory: HttpAuthGuardFactory,
    httpRequestCtxFactory: HttpRequestCtxFactory,
    credentialCrudService: CredentialCrudService,
  ) {
    this.#httpAuthGuardFactory = httpAuthGuardFactory;
    this.#httpRequestCtxFactory = httpRequestCtxFactory;
    this.#credentialCrudService = credentialCrudService;
  }

  make() {
    return new Elysia({ name: CredentialV1HttpRouterFactory.name })
      .use(this.#httpRequestCtxFactory.make())
      .use(this.#httpAuthGuardFactory.make())
      .group("/api/v1/credential", (r) =>
        r
          .post(
            "",
            async ({ body, ctx, tenant }) => {
              const result = await this.#credentialCrudService.create({
                ctx: { ...ctx, tenant },
                payload: body,
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              body: postCredentialRequestBodyDtoSchema,
            },
          )
          .get("", async ({ ctx, tenant }) => {
            const result = await this.#credentialCrudService.list({
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
              const result = await this.#credentialCrudService.get({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope({ data: this.#toDto(result.value) });
            },
            {
              params: credentialRequestParamsDtoSchema,
            },
          )
          .patch(
            "/:id",
            async ({ body, ctx, tenant, params }) => {
              const result = await this.#credentialCrudService.update({
                ctx: { ...ctx, tenant },
                payload: {
                  id: params.id,
                  data: body,
                },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              body: patchCredentialRequestBodyDtoSchema,
              params: credentialRequestParamsDtoSchema,
            },
          )
          .delete(
            "/:id",
            async ({ ctx, tenant, params }) => {
              const result = await this.#credentialCrudService.delete({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              params: credentialRequestParamsDtoSchema,
            },
          ),
      );
  }

  #toDto(entity: CredentialEntity): CredentialResponseDto {
    const base = {
      id: entity.id,
      name: entity.props.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      expiredAt: entity.props.expiredAt,
    };

    if (entity.props.type === "apiKey") {
      return {
        ...base,
        type: "apiKey",
        apiKey: entity.props.apiKey,
      };
    }

    return {
      ...base,
      type: "basic",
      username: entity.props.username,
      password: entity.props.password,
    };
  }
}
