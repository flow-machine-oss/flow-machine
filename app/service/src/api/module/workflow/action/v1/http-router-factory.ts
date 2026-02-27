import Elysia from "elysia";
import { errEnvelope, okEnvelope } from "@/api/http-envelope";
import type { WorkflowActionDefinitionResponseDto } from "@/api/module/workflow/action/v1/http-dto";
import type { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import type { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import type { WorkflowActionDefinitionCrudService } from "@/core/domain/workflow/definition/action/crud-service";
import type { WorkflowActionDefinitionEntity } from "@/core/domain/workflow/definition/action/entity";

export class WorkflowActionDefinitionV1HttpRouterFactory {
  #httpAuthGuardFactory: HttpAuthGuardFactory;
  #httpRequestCtxFactory: HttpRequestCtxFactory;
  #workflowActionDefinitionCrudService: WorkflowActionDefinitionCrudService;

  constructor(
    httpAuthGuardFactory: HttpAuthGuardFactory,
    httpRequestCtxFactory: HttpRequestCtxFactory,
    workflowActionDefinitionCrudService: WorkflowActionDefinitionCrudService,
  ) {
    this.#httpAuthGuardFactory = httpAuthGuardFactory;
    this.#httpRequestCtxFactory = httpRequestCtxFactory;
    this.#workflowActionDefinitionCrudService =
      workflowActionDefinitionCrudService;
  }

  make() {
    return new Elysia({
      name: WorkflowActionDefinitionV1HttpRouterFactory.name,
    })
      .use(this.#httpRequestCtxFactory.make())
      .use(this.#httpAuthGuardFactory.make())
      .group("/api/v1/workflow-action-definition", (r) =>
        r.get("", async () => {
          const result = await this.#workflowActionDefinitionCrudService.list();
          if (result.isErr()) {
            return errEnvelope(result.error);
          }
          return okEnvelope({ data: result.value.map(this.#toDto) });
        }),
      );
  }

  #toDto(
    entity: WorkflowActionDefinitionEntity,
  ): WorkflowActionDefinitionResponseDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      kind: entity.props.kind,
      name: entity.props.name,
    };
  }
}
