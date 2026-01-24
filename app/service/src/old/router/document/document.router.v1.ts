import Elysia from "elysia";
import z from "zod";
import { createDocumentRequestBodySchema } from "@/old/dto/document/create-document.dto";
import { documentResponseDtoSchema } from "@/old/dto/document/document.dto";
import { updateDocumentRequestBodySchema } from "@/old/dto/document/update-document.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createDocumentUseCase } from "@/old/use-case/document/create-document.use-case";
import { deleteDocumentUseCase } from "@/old/use-case/document/delete-document.use-case";
import { getDocumentUseCase } from "@/old/use-case/document/get-document.use-case";
import { listDocumentsUseCase } from "@/old/use-case/document/list-documents.use-case";
import { updateDocumentUseCase } from "@/old/use-case/document/update-document.use-case";

export const documentRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/document", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createDocumentResult = await createDocumentUseCase(ctx, {
              body,
              organizationId: user.organizationId,
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
          async ({ ctx, user }) => {
            const listDocumentsResult = await listDocumentsUseCase(ctx, {
              organizationId: user.organizationId,
            });

            if (listDocumentsResult.isErr()) {
              return errEnvelope(listDocumentsResult.error);
            }

            return okEnvelope({ data: listDocumentsResult.value });
          },
          {
            response: withHttpEnvelopeSchema(
              z.array(documentResponseDtoSchema),
            ),
          },
        )
        .get(
          "/:id",
          async ({ ctx, params, user }) => {
            const getDocumentResult = await getDocumentUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (getDocumentResult.isErr()) {
              return errEnvelope(getDocumentResult.error);
            }

            return okEnvelope({ data: getDocumentResult.value });
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(documentResponseDtoSchema),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, params, user }) => {
            const updateDocumentResult = await updateDocumentUseCase(ctx, {
              id: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (updateDocumentResult.isErr()) {
              return errEnvelope(updateDocumentResult.error);
            }

            return okEnvelope();
          },
          {
            body: updateDocumentRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteDocumentResult = await deleteDocumentUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (deleteDocumentResult.isErr()) {
              return errEnvelope(deleteDocumentResult.error);
            }

            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
