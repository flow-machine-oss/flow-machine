import Elysia from "elysia";
import z from "zod";
import { createDocumentRequestBodySchema } from "@/dto/document/create-document.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createDocumentUseCase } from "@/use-case/document/create-document.use-case";

export const documentRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/document", (r) =>
    r.post(
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
    ),
  );
