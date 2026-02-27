import Elysia from "elysia";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import {
  type AiAgentResponseDto,
  patchAiAgentRequestBodyDtoSchema,
  patchAiAgentRequestParamsDtoSchema,
  postAiAgentRequestBodyDtoSchema,
} from "@/v2/api/module/ai-agent/v1/http-dto";
import type { HttpAuthGuardFactory } from "@/v2/api/plugin/http-auth-guard-factory";
import type { HttpRequestCtxFactory } from "@/v2/api/plugin/http-request-ctx-factory";
import type { AiAgentCrudService } from "@/v2/core/domain/ai-agent/crud-service";
import type { AiAgentEntity } from "@/v2/core/domain/ai-agent/entity";

export class AiAgentV1HttpRouterFactory {
  #httpAuthGuardFactory: HttpAuthGuardFactory;
  #httpRequestCtxFactory: HttpRequestCtxFactory;
  #aiAgentCrudService: AiAgentCrudService;

  constructor(
    httpAuthGuardFactory: HttpAuthGuardFactory,
    httpRequestCtxFactory: HttpRequestCtxFactory,
    aiAgentCrudService: AiAgentCrudService,
  ) {
    this.#httpAuthGuardFactory = httpAuthGuardFactory;
    this.#httpRequestCtxFactory = httpRequestCtxFactory;
    this.#aiAgentCrudService = aiAgentCrudService;
  }

  make() {
    return new Elysia({ name: AiAgentV1HttpRouterFactory.name })
      .use(this.#httpRequestCtxFactory.make())
      .use(this.#httpAuthGuardFactory.make())
      .group("/api/v1/ai-agent", (r) =>
        r
          .post(
            "",
            async ({ body, ctx, tenant }) => {
              const result = await this.#aiAgentCrudService.create({
                ctx: { ...ctx, tenant },
                payload: body,
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              body: postAiAgentRequestBodyDtoSchema,
            },
          )
          .get("", async ({ ctx, tenant }) => {
            const result = await this.#aiAgentCrudService.list({
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
              const result = await this.#aiAgentCrudService.get({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope({ data: this.#toDto(result.value) });
            },
            {
              params: patchAiAgentRequestParamsDtoSchema,
            },
          )
          .patch(
            "/:id",
            async ({ body, ctx, tenant, params }) => {
              const result = await this.#aiAgentCrudService.update({
                ctx: { ...ctx, tenant },
                payload: {
                  id: params.id,
                  name: body.name,
                  model: body.model,
                  projects: body.projects,
                },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              body: patchAiAgentRequestBodyDtoSchema,
              params: patchAiAgentRequestParamsDtoSchema,
            },
          )
          .delete(
            "/:id",
            async ({ ctx, tenant, params }) => {
              const result = await this.#aiAgentCrudService.delete({
                ctx: { ...ctx, tenant },
                payload: { id: params.id },
              });
              if (result.isErr()) {
                return errEnvelope(result.error);
              }
              return okEnvelope();
            },
            {
              params: patchAiAgentRequestParamsDtoSchema,
            },
          ),
      );
  }

  #toDto(entity: AiAgentEntity) {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tenant: entity.tenant,
      name: entity.props.name,
      model: entity.props.model,
      projects: entity.props.projects,
    } as const satisfies AiAgentResponseDto;
  }
}
