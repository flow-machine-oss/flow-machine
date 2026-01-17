import Elysia from "elysia";
import z from "zod";
import { createGitRepositoryIntegrationRequestBodySchema } from "@/dto/git-repository/create-git-repository-integration.dto";
import { createGitRepositoryRequestBodySchema } from "@/dto/git-repository/create-git-repository.dto";
import { gitRepositoryIntegrationParamsSchema } from "@/dto/git-repository/git-repository-integration-params.dto";
import { gitRepositoryIntegrationResponseDtoSchema } from "@/dto/git-repository/git-repository-integration.dto";
import { gitRepositoryResponseDtoSchema } from "@/dto/git-repository/git-repository.dto";
import { updateGitRepositoryIntegrationRequestBodySchema } from "@/dto/git-repository/update-git-repository-integration.dto";
import { updateGitRepositoryRequestBodySchema } from "@/dto/git-repository/update-git-repository.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createGitRepositoryIntegrationUseCase } from "@/use-case/git-repository/create-git-repository-integration.use-case";
import { createGitRepositoryUseCase } from "@/use-case/git-repository/create-git-repository.use-case";
import { deleteGitRepositoryIntegrationUseCase } from "@/use-case/git-repository/delete-git-repository-integration.use-case";
import { deleteGitRepositoryUseCase } from "@/use-case/git-repository/delete-git-repository.use-case";
import { getGitRepositoryIntegrationUseCase } from "@/use-case/git-repository/get-git-repository-integration.use-case";
import { getGitRepositoryUseCase } from "@/use-case/git-repository/get-git-repository.use-case";
import { listGitRepositoriesUseCase } from "@/use-case/git-repository/list-git-repositories.use-case";
import { updateGitRepositoryIntegrationUseCase } from "@/use-case/git-repository/update-git-repository-integration.use-case";
import { updateGitRepositoryUseCase } from "@/use-case/git-repository/update-git-repository.use-case";

export const gitRepositoryRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/git-repository", (r) =>
    r
      // Git Repository CRUD
      .post(
        "",
        async ({ body, ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createGitRepositoryUseCase(ctx, {
            body,
            user: authCheckResult.value,
          });

          if (createResult.isErr()) {
            return errEnvelope(createResult.error);
          }
          return okEnvelope();
        },
        {
          body: createGitRepositoryRequestBodySchema,
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

          const listResult = await listGitRepositoriesUseCase(ctx, {
            user: authCheckResult.value,
          });

          if (listResult.isErr()) {
            return errEnvelope(listResult.error);
          }
          return okEnvelope({ data: listResult.value });
        },
        {
          response: withHttpEnvelopeSchema(
            z.array(gitRepositoryResponseDtoSchema),
          ),
        },
      )
      .get(
        "/:id",
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getResult = await getGitRepositoryUseCase(ctx, {
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
          response: withHttpEnvelopeSchema(gitRepositoryResponseDtoSchema),
        },
      )
      .patch(
        "/:id",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateGitRepositoryUseCase(ctx, {
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
          body: updateGitRepositoryRequestBodySchema,
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

          const deleteResult = await deleteGitRepositoryUseCase(ctx, {
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
      // Git Repository Integration CRUD (nested)
      .post(
        "/:id/integration",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createGitRepositoryIntegrationUseCase(
            ctx,
            {
              gitRepositoryId: params.id,
              body,
              user: authCheckResult.value,
            },
          );

          if (createResult.isErr()) {
            return errEnvelope(createResult.error);
          }
          return okEnvelope();
        },
        {
          body: createGitRepositoryIntegrationRequestBodySchema,
          params: idRequestParamsDtoSchema,
          response: withHttpEnvelopeSchema(z.undefined()),
        },
      )
      .get(
        "/:id/integration/:integrationId",
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getResult = await getGitRepositoryIntegrationUseCase(ctx, {
            gitRepositoryId: params.id,
            integrationId: params.integrationId,
            user: authCheckResult.value,
          });

          if (getResult.isErr()) {
            return errEnvelope(getResult.error);
          }
          return okEnvelope({ data: getResult.value });
        },
        {
          params: gitRepositoryIntegrationParamsSchema,
          response: withHttpEnvelopeSchema(
            gitRepositoryIntegrationResponseDtoSchema,
          ),
        },
      )
      .patch(
        "/:id/integration/:integrationId",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateGitRepositoryIntegrationUseCase(
            ctx,
            {
              gitRepositoryId: params.id,
              integrationId: params.integrationId,
              body,
              user: authCheckResult.value,
            },
          );

          if (updateResult.isErr()) {
            return errEnvelope(updateResult.error);
          }
          return okEnvelope();
        },
        {
          body: updateGitRepositoryIntegrationRequestBodySchema,
          params: gitRepositoryIntegrationParamsSchema,
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

          const deleteResult = await deleteGitRepositoryIntegrationUseCase(
            ctx,
            {
              gitRepositoryId: params.id,
              integrationId: params.integrationId,
              user: authCheckResult.value,
            },
          );

          if (deleteResult.isErr()) {
            return errEnvelope(deleteResult.error);
          }
          return okEnvelope();
        },
        {
          params: gitRepositoryIntegrationParamsSchema,
          response: withHttpEnvelopeSchema(z.undefined()),
        },
      ),
  );
