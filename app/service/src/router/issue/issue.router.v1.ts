import Elysia from "elysia";
import z from "zod";
import { createIssueFieldInstanceIntegrationRequestBodySchema } from "@/dto/issue/create-issue-field-instance-integration.dto";
import { createIssueFieldInstanceRequestBodySchema } from "@/dto/issue/create-issue-field-instance.dto";
import { createIssueRequestBodySchema } from "@/dto/issue/create-issue.dto";
import { issueFieldInstanceIntegrationParamsSchema } from "@/dto/issue/issue-field-instance-integration-params.dto";
import { issueFieldInstanceParamsSchema } from "@/dto/issue/issue-field-instance-params.dto";
import { issueResponseDtoSchema } from "@/dto/issue/issue.dto";
import { updateIssueFieldInstanceIntegrationRequestBodySchema } from "@/dto/issue/update-issue-field-instance-integration.dto";
import { updateIssueFieldInstanceRequestBodySchema } from "@/dto/issue/update-issue-field-instance.dto";
import { updateIssueRequestBodySchema } from "@/dto/issue/update-issue.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createIssueFieldInstanceIntegrationUseCase } from "@/use-case/issue/create-issue-field-instance-integration.use-case";
import { createIssueFieldInstanceUseCase } from "@/use-case/issue/create-issue-field-instance.use-case";
import { createIssueUseCase } from "@/use-case/issue/create-issue.use-case";
import { deleteIssueFieldInstanceIntegrationUseCase } from "@/use-case/issue/delete-issue-field-instance-integration.use-case";
import { deleteIssueFieldInstanceUseCase } from "@/use-case/issue/delete-issue-field-instance.use-case";
import { deleteIssueUseCase } from "@/use-case/issue/delete-issue.use-case";
import { getIssueUseCase } from "@/use-case/issue/get-issue.use-case";
import { listIssuesUseCase } from "@/use-case/issue/list-issues.use-case";
import { updateIssueFieldInstanceIntegrationUseCase } from "@/use-case/issue/update-issue-field-instance-integration.use-case";
import { updateIssueFieldInstanceUseCase } from "@/use-case/issue/update-issue-field-instance.use-case";
import { updateIssueUseCase } from "@/use-case/issue/update-issue.use-case";

export const issueRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/issue", (r) =>
    r
      // Issue CRUD
      .post(
        "",
        async ({ body, ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createIssueUseCase(ctx, {
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const listResult = await listIssuesUseCase(ctx, {
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getResult = await getIssueUseCase(ctx, {
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
          response: withHttpEnvelopeSchema(issueResponseDtoSchema),
        },
      )
      .patch(
        "/:id",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateIssueUseCase(ctx, {
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
          body: updateIssueRequestBodySchema,
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

          const deleteResult = await deleteIssueUseCase(ctx, {
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
      // Issue Field Instance CRUD (nested under issue)
      .post(
        "/:id/field-instance",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createIssueFieldInstanceUseCase(ctx, {
            issueId: params.id,
            body,
            user: authCheckResult.value,
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
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult = await updateIssueFieldInstanceUseCase(ctx, {
            issueId: params.id,
            fieldInstanceId: params.fieldInstanceId,
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const deleteResult = await deleteIssueFieldInstanceUseCase(ctx, {
            issueId: params.id,
            fieldInstanceId: params.fieldInstanceId,
            user: authCheckResult.value,
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
      // Issue Field Instance Integration CRUD (nested under field instance)
      .post(
        "/:id/field-instance/:fieldInstanceId/integration",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const createResult = await createIssueFieldInstanceIntegrationUseCase(
            ctx,
            {
              issueId: params.id,
              fieldInstanceId: params.fieldInstanceId,
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
          body: createIssueFieldInstanceIntegrationRequestBodySchema,
          params: issueFieldInstanceParamsSchema,
          response: withHttpEnvelopeSchema(z.undefined()),
        },
      )
      .patch(
        "/:id/field-instance/:fieldInstanceId/integration/:integrationId",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateResult =
            await updateIssueFieldInstanceIntegrationUseCase(ctx, {
              issueId: params.id,
              fieldInstanceId: params.fieldInstanceId,
              integrationId: params.integrationId,
              body,
              user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const deleteResult =
            await deleteIssueFieldInstanceIntegrationUseCase(ctx, {
              issueId: params.id,
              fieldInstanceId: params.fieldInstanceId,
              integrationId: params.integrationId,
              user: authCheckResult.value,
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
