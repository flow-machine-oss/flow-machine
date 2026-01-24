import Elysia from "elysia";
import z from "zod";
import { createProjectIntegrationRequestBodySchema } from "@/old/dto/project/create-project-integration.dto";
import { createProjectRequestBodySchema } from "@/old/dto/project/create-project.dto";
import { projectIntegrationParamsSchema } from "@/old/dto/project/project-integration-params.dto";
import { projectResponseDtoSchema } from "@/old/dto/project/project.dto";
import { updateProjectIntegrationRequestBodySchema } from "@/old/dto/project/update-project-integration.dto";
import { updateProjectRequestBodySchema } from "@/old/dto/project/update-project.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createProjectIntegrationUseCase } from "@/old/use-case/project/create-project-integration.use-case";
import { createProjectUseCase } from "@/old/use-case/project/create-project.use-case";
import { deleteProjectIntegrationUseCase } from "@/old/use-case/project/delete-project-integration.use-case";
import { deleteProjectUseCase } from "@/old/use-case/project/delete-project.use-case";
import { getProjectUseCase } from "@/old/use-case/project/get-project.use-case";
import { listProjectsUseCase } from "@/old/use-case/project/list-projects.use-case";
import { updateProjectIntegrationUseCase } from "@/old/use-case/project/update-project-integration.use-case";
import { updateProjectUseCase } from "@/old/use-case/project/update-project.use-case";

export const projectRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/project", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createResult = await createProjectUseCase(ctx, {
              body,
              organizationId: user.organizationId,
            });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createProjectRequestBodySchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .get(
          "",
          async ({ ctx, user }) => {
            const listResult = await listProjectsUseCase(ctx, {
              organizationId: user.organizationId,
            });

            if (listResult.isErr()) {
              return errEnvelope(listResult.error);
            }
            return okEnvelope({ data: listResult.value });
          },
          {
            response: withHttpEnvelopeSchema(z.array(projectResponseDtoSchema)),
          },
        )
        .get(
          "/:id",
          async ({ ctx, params, user }) => {
            const getResult = await getProjectUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (getResult.isErr()) {
              return errEnvelope(getResult.error);
            }
            return okEnvelope({ data: getResult.value });
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(projectResponseDtoSchema),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateProjectUseCase(ctx, {
              id: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (updateResult.isErr()) {
              return errEnvelope(updateResult.error);
            }
            return okEnvelope();
          },
          {
            body: updateProjectRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteProjectUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }
            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .post(
          "/:id/integration",
          async ({ body, ctx, params, user }) => {
            const createResult = await createProjectIntegrationUseCase(ctx, {
              projectId: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createProjectIntegrationRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .patch(
          "/:id/integration/:integrationId",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateProjectIntegrationUseCase(ctx, {
              projectId: params.id,
              projectIntegrationId: params.integrationId,
              body,
              organizationId: user.organizationId,
            });

            if (updateResult.isErr()) {
              return errEnvelope(updateResult.error);
            }
            return okEnvelope();
          },
          {
            body: updateProjectIntegrationRequestBodySchema,
            params: projectIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id/integration/:integrationId",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteProjectIntegrationUseCase(ctx, {
              projectId: params.id,
              projectIntegrationId: params.integrationId,
              organizationId: user.organizationId,
            });

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }
            return okEnvelope();
          },
          {
            params: projectIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
