import Elysia from "elysia";
import z from "zod";
import { createProjectIntegrationRequestBodySchema } from "@/dto/project/create-project-integration.dto";
import { createProjectRequestBodySchema } from "@/dto/project/create-project.dto";
import { projectIntegrationParamsSchema } from "@/dto/project/project-integration-params.dto";
import { projectResponseDtoSchema } from "@/dto/project/project.dto";
import { updateProjectIntegrationRequestBodySchema } from "@/dto/project/update-project-integration.dto";
import { updateProjectRequestBodySchema } from "@/dto/project/update-project.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createProjectIntegrationUseCase } from "@/use-case/project/create-project-integration.use-case";
import { createProjectUseCase } from "@/use-case/project/create-project.use-case";
import { deleteProjectIntegrationUseCase } from "@/use-case/project/delete-project-integration.use-case";
import { deleteProjectUseCase } from "@/use-case/project/delete-project.use-case";
import { getProjectUseCase } from "@/use-case/project/get-project.use-case";
import { listProjectsUseCase } from "@/use-case/project/list-projects.use-case";
import { updateProjectIntegrationUseCase } from "@/use-case/project/update-project-integration.use-case";
import { updateProjectUseCase } from "@/use-case/project/update-project.use-case";

export const projectRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/project", (r) =>
    r
      .post(
        "",
        async ({ body, ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createProjectUseCase(ctx, {
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const listResult = await listProjectsUseCase(ctx, {
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getResult = await getProjectUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
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
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateProjectUseCase(ctx, {
            id: params.id,
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const deleteResult = await deleteProjectUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
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
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createProjectIntegrationUseCase(ctx, {
            projectId: params.id,
            body,
            user: authCheckResult.value,
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
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateProjectIntegrationUseCase(ctx, {
            projectId: params.id,
            projectIntegrationId: params.integrationId,
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const deleteResult = await deleteProjectIntegrationUseCase(ctx, {
            projectId: params.id,
            projectIntegrationId: params.integrationId,
            user: authCheckResult.value,
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
