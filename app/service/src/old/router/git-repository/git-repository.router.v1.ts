import Elysia from "elysia";
import z from "zod";
import { createGitRepositoryIntegrationRequestBodySchema } from "@/old/dto/git-repository/create-git-repository-integration.dto";
import { createGitRepositoryRequestBodySchema } from "@/old/dto/git-repository/create-git-repository.dto";
import { gitRepositoryIntegrationParamsSchema } from "@/old/dto/git-repository/git-repository-integration-params.dto";
import { gitRepositoryResponseDtoSchema } from "@/old/dto/git-repository/git-repository.dto";
import { updateGitRepositoryIntegrationRequestBodySchema } from "@/old/dto/git-repository/update-git-repository-integration.dto";
import { updateGitRepositoryRequestBodySchema } from "@/old/dto/git-repository/update-git-repository.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createGitRepositoryIntegrationUseCase } from "@/old/use-case/git-repository/create-git-repository-integration.use-case";
import { createGitRepositoryUseCase } from "@/old/use-case/git-repository/create-git-repository.use-case";
import { deleteGitRepositoryIntegrationUseCase } from "@/old/use-case/git-repository/delete-git-repository-integration.use-case";
import { deleteGitRepositoryUseCase } from "@/old/use-case/git-repository/delete-git-repository.use-case";
import { getGitRepositoryUseCase } from "@/old/use-case/git-repository/get-git-repository.use-case";
import { listGitRepositoriesUseCase } from "@/old/use-case/git-repository/list-git-repositories.use-case";
import { updateGitRepositoryIntegrationUseCase } from "@/old/use-case/git-repository/update-git-repository-integration.use-case";
import { updateGitRepositoryUseCase } from "@/old/use-case/git-repository/update-git-repository.use-case";

export const gitRepositoryRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/git-repository", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createResult = await createGitRepositoryUseCase(ctx, {
              body,
              organizationId: user.organizationId,
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
          async ({ ctx, user }) => {
            const listResult = await listGitRepositoriesUseCase(ctx, {
              organizationId: user.organizationId,
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
          async ({ ctx, params, user }) => {
            const getResult = await getGitRepositoryUseCase(ctx, {
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
            response: withHttpEnvelopeSchema(gitRepositoryResponseDtoSchema),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateGitRepositoryUseCase(ctx, {
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
            body: updateGitRepositoryRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteGitRepositoryUseCase(ctx, {
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
            const createResult = await createGitRepositoryIntegrationUseCase(
              ctx,
              {
                gitRepositoryId: params.id,
                body,
                organizationId: user.organizationId,
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
        .patch(
          "/:id/integration/:integrationId",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateGitRepositoryIntegrationUseCase(
              ctx,
              {
                gitRepositoryId: params.id,
                gitRepositoryIntegrationId: params.integrationId,
                body,
                organizationId: user.organizationId,
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
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteGitRepositoryIntegrationUseCase(
              ctx,
              {
                gitRepositoryId: params.id,
                gitRepositoryIntegrationId: params.integrationId,
                organizationId: user.organizationId,
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
