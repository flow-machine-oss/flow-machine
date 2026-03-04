import Elysia from "elysia";
import type { Result } from "neverthrow";
import { errEnvelope, okEnvelope } from "@/api/http-envelope";
import {
  postProjectSyncRequestBodyDtoSchema,
  postProjectSyncRequestParamsDtoSchema,
} from "@/api/module/project/v1/sync/http-dto";
import type { HttpAuthGuardFactory } from "@/api/plugin/http-auth-guard-factory";
import type { HttpRequestCtxFactory } from "@/api/plugin/http-request-ctx-factory";
import type { ProjectSyncBasicService } from "@/app/feature/project/sync/basic-service";
import type { Err } from "@/common/err/err";

export class ProjectSyncV1HttpRouterFactory {
  #httpAuthGuardFactory: HttpAuthGuardFactory;
  #httpRequestCtxFactory: HttpRequestCtxFactory;
  #projectSyncBasicService: ProjectSyncBasicService;

  constructor(
    httpAuthGuardFactory: HttpAuthGuardFactory,
    httpRequestCtxFactory: HttpRequestCtxFactory,
    projectSyncBasicService: ProjectSyncBasicService,
  ) {
    this.#httpAuthGuardFactory = httpAuthGuardFactory;
    this.#httpRequestCtxFactory = httpRequestCtxFactory;
    this.#projectSyncBasicService = projectSyncBasicService;
  }

  make() {
    return new Elysia({ name: ProjectSyncV1HttpRouterFactory.name })
      .use(this.#httpRequestCtxFactory.make())
      .use(this.#httpAuthGuardFactory.make())
      .group("/api/v1/project/:projectId/sync", (r) =>
        r.post(
          "",
          async ({ body, ctx, params, tenant }) => {
            const { entityType } = body;
            const { projectId } = params;

            let result: Result<void, Err>;
            switch (entityType) {
              case "aiAgent": {
                result = await this.#projectSyncBasicService.syncAiAgents({
                  ctx: { ...ctx, tenant },
                  payload: { projectId },
                });
                break;
              }
              case "gitRepository": {
                result =
                  await this.#projectSyncBasicService.syncGitRepositories({
                    ctx: { ...ctx, tenant },
                    payload: { projectId },
                  });
                break;
              }
              case "workflowDefinition": {
                result =
                  await this.#projectSyncBasicService.syncWorkflowDefinitions({
                    ctx: { ...ctx, tenant },
                    payload: { projectId },
                  });
                break;
              }
            }

            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postProjectSyncRequestBodyDtoSchema,
            params: postProjectSyncRequestParamsDtoSchema,
          },
        ),
      );
  }
}
