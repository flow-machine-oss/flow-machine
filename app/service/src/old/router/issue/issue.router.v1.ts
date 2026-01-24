import Elysia from "elysia";
import z from "zod";
import { createIssueFieldInstanceIntegrationRequestBodySchema } from "@/old/dto/issue/create-issue-field-instance-integration.dto";
import { createIssueFieldInstanceRequestBodySchema } from "@/old/dto/issue/create-issue-field-instance.dto";
import { createIssueIntegrationRequestBodySchema } from "@/old/dto/issue/create-issue-integration.dto";
import { createIssueRequestBodySchema } from "@/old/dto/issue/create-issue.dto";
import { issueFieldInstanceIntegrationParamsSchema } from "@/old/dto/issue/issue-field-instance-integration-params.dto";
import { issueFieldInstanceParamsSchema } from "@/old/dto/issue/issue-field-instance-params.dto";
import { issueIntegrationParamsSchema } from "@/old/dto/issue/issue-integration-params.dto";
import { issueResponseDtoSchema } from "@/old/dto/issue/issue.dto";
import { updateIssueFieldInstanceIntegrationRequestBodySchema } from "@/old/dto/issue/update-issue-field-instance-integration.dto";
import { updateIssueFieldInstanceRequestBodySchema } from "@/old/dto/issue/update-issue-field-instance.dto";
import { updateIssueIntegrationRequestBodySchema } from "@/old/dto/issue/update-issue-integration.dto";
import { updateIssueRequestBodySchema } from "@/old/dto/issue/update-issue.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createIssueFieldInstanceIntegrationUseCase } from "@/old/use-case/issue/create-issue-field-instance-integration.use-case";
import { createIssueFieldInstanceUseCase } from "@/old/use-case/issue/create-issue-field-instance.use-case";
import { createIssueIntegrationUseCase } from "@/old/use-case/issue/create-issue-integration.use-case";
import { createIssueUseCase } from "@/old/use-case/issue/create-issue.use-case";
import { deleteIssueFieldInstanceIntegrationUseCase } from "@/old/use-case/issue/delete-issue-field-instance-integration.use-case";
import { deleteIssueFieldInstanceUseCase } from "@/old/use-case/issue/delete-issue-field-instance.use-case";
import { deleteIssueIntegrationUseCase } from "@/old/use-case/issue/delete-issue-integration.use-case";
import { deleteIssueUseCase } from "@/old/use-case/issue/delete-issue.use-case";
import { getIssueUseCase } from "@/old/use-case/issue/get-issue.use-case";
import { listIssuesUseCase } from "@/old/use-case/issue/list-issues.use-case";
import { updateIssueFieldInstanceIntegrationUseCase } from "@/old/use-case/issue/update-issue-field-instance-integration.use-case";
import { updateIssueFieldInstanceUseCase } from "@/old/use-case/issue/update-issue-field-instance.use-case";
import { updateIssueIntegrationUseCase } from "@/old/use-case/issue/update-issue-integration.use-case";
import { updateIssueUseCase } from "@/old/use-case/issue/update-issue.use-case";

export const issueRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/issue", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createResult = await createIssueUseCase(ctx, {
              body,
              organizationId: user.organizationId,
            });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIssueRequestBodySchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .get(
          "",
          async ({ ctx, user }) => {
            const listResult = await listIssuesUseCase(ctx, {
              organizationId: user.organizationId,
            });

            if (listResult.isErr()) {
              return errEnvelope(listResult.error);
            }
            return okEnvelope({ data: listResult.value });
          },
          {
            response: withHttpEnvelopeSchema(z.array(issueResponseDtoSchema)),
          },
        )
        .get(
          "/:id",
          async ({ ctx, params, user }) => {
            const getResult = await getIssueUseCase(ctx, {
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
            response: withHttpEnvelopeSchema(issueResponseDtoSchema),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateIssueUseCase(ctx, {
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
            body: updateIssueRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteIssueUseCase(ctx, {
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
            const createResult = await createIssueIntegrationUseCase(ctx, {
              issueId: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIssueIntegrationRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .patch(
          "/:id/integration/:integrationId",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateIssueIntegrationUseCase(ctx, {
              issueId: params.id,
              issueIntegrationId: params.integrationId,
              body,
              organizationId: user.organizationId,
            });

            if (updateResult.isErr()) {
              return errEnvelope(updateResult.error);
            }
            return okEnvelope();
          },
          {
            body: updateIssueIntegrationRequestBodySchema,
            params: issueIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id/integration/:integrationId",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteIssueIntegrationUseCase(ctx, {
              issueId: params.id,
              issueIntegrationId: params.integrationId,
              organizationId: user.organizationId,
            });

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }
            return okEnvelope();
          },
          {
            params: issueIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )

        .post(
          "/:id/field-instance",
          async ({ body, ctx, params, user }) => {
            const createResult = await createIssueFieldInstanceUseCase(ctx, {
              issueId: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIssueFieldInstanceRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .patch(
          "/:id/field-instance/:fieldInstanceId",
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateIssueFieldInstanceUseCase(ctx, {
              issueId: params.id,
              fieldInstanceId: params.fieldInstanceId,
              body,
              organizationId: user.organizationId,
            });

            if (updateResult.isErr()) {
              return errEnvelope(updateResult.error);
            }
            return okEnvelope();
          },
          {
            body: updateIssueFieldInstanceRequestBodySchema,
            params: issueFieldInstanceParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id/field-instance/:fieldInstanceId",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteIssueFieldInstanceUseCase(ctx, {
              issueId: params.id,
              fieldInstanceId: params.fieldInstanceId,
              organizationId: user.organizationId,
            });

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }
            return okEnvelope();
          },
          {
            params: issueFieldInstanceParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )

        .post(
          "/:id/field-instance/:fieldInstanceId/integration",
          async ({ body, ctx, params, user }) => {
            const createResult =
              await createIssueFieldInstanceIntegrationUseCase(ctx, {
                issueId: params.id,
                fieldInstanceId: params.fieldInstanceId,
                body,
                organizationId: user.organizationId,
              });

            if (createResult.isErr()) {
              return errEnvelope(createResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIssueFieldInstanceIntegrationRequestBodySchema,
            params: issueFieldInstanceParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .patch(
          "/:id/field-instance/:fieldInstanceId/integration/:integrationId",
          async ({ body, ctx, params, user }) => {
            const updateResult =
              await updateIssueFieldInstanceIntegrationUseCase(ctx, {
                issueId: params.id,
                fieldInstanceId: params.fieldInstanceId,
                integrationId: params.integrationId,
                body,
                organizationId: user.organizationId,
              });

            if (updateResult.isErr()) {
              return errEnvelope(updateResult.error);
            }
            return okEnvelope();
          },
          {
            body: updateIssueFieldInstanceIntegrationRequestBodySchema,
            params: issueFieldInstanceIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id/field-instance/:fieldInstanceId/integration/:integrationId",
          async ({ ctx, params, user }) => {
            const deleteResult =
              await deleteIssueFieldInstanceIntegrationUseCase(ctx, {
                issueId: params.id,
                fieldInstanceId: params.fieldInstanceId,
                integrationId: params.integrationId,
                organizationId: user.organizationId,
              });

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }
            return okEnvelope();
          },
          {
            params: issueFieldInstanceIntegrationParamsSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
