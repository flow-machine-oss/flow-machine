import Elysia, { t } from "elysia";
import z from "zod";
import { createDocumentRequestBodySchema } from "@/dto/document/create-document.dto";
import { documentResponseDtoSchema } from "@/dto/document/document.dto";
import { updateDocumentRequestBodySchema } from "@/dto/document/update-document.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createDocumentUseCase } from "@/use-case/document/create-document.use-case";
import { deleteDocumentUseCase } from "@/use-case/document/delete-document.use-case";
import { getDocumentUseCase } from "@/use-case/document/get-document.use-case";
import { listDocumentsUseCase } from "@/use-case/document/list-documents.use-case";
import { updateDocumentUseCase } from "@/use-case/document/update-document.use-case";

export const documentRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/document", (r) =>
    r
      .post(
        "",
        async ({ body, ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }
          const createDocumentResult = await createDocumentUseCase(ctx, {
            body,
            user: authCheckResult.value,
          });

          if (createDocumentResult.isErr()) {
            return errEnvelope(createDocumentResult.error);
          }
          return okEnvelope();
        },
        {
          body: createDocumentRequestBodySchema,
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

          const listDocumentsResult = await listDocumentsUseCase(ctx, {
            user: authCheckResult.value,
          });

          if (listDocumentsResult.isErr()) {
            return errEnvelope(listDocumentsResult.error);
          }

          return okEnvelope({ data: listDocumentsResult.value });
        },
        {
          response: withHttpEnvelopeSchema(z.array(documentResponseDtoSchema)),
        },
      )
      .get(
        "/:id",
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getDocumentResult = await getDocumentUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
          });

          if (getDocumentResult.isErr()) {
            return errEnvelope(getDocumentResult.error);
          }

          return okEnvelope({ data: getDocumentResult.value });
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          response: withHttpEnvelopeSchema(documentResponseDtoSchema),
        },
      )
      .patch(
        "/:id",
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateDocumentResult = await updateDocumentUseCase(ctx, {
            id: params.id,
            body,
            user: authCheckResult.value,
          });

          if (updateDocumentResult.isErr()) {
            return errEnvelope(updateDocumentResult.error);
          }

          return okEnvelope();
        },
        {
          body: updateDocumentRequestBodySchema,
          params: t.Object({
            id: t.String(),
          }),
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

          const deleteDocumentResult = await deleteDocumentUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
          });

          if (deleteDocumentResult.isErr()) {
            return errEnvelope(deleteDocumentResult.error);
          }

          return okEnvelope();
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          response: withHttpEnvelopeSchema(z.undefined()),
        },
      ),
  );
