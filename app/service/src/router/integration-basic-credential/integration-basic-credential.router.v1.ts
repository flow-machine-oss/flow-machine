import Elysia from "elysia";
import { omit } from "es-toolkit";
import z from "zod";
import { createIntegrationBasicCredentialRequestBodySchema } from "@/dto/integration-basic-credential/create-integration-basic-credential.dto";
import { integrationBasicCredentialResponseDtoSchema } from "@/dto/integration-basic-credential/integration-basic-credential.dto";
import { updateIntegrationBasicCredentialRequestBodySchema } from "@/dto/integration-basic-credential/update-integration-basic-credential.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createIntegrationBasicCredentialUseCase } from "@/use-case/integration-basic-credential/create-integration-basic-credential.use-case";
import { deleteIntegrationBasicCredentialUseCase } from "@/use-case/integration-basic-credential/delete-integration-basic-credential.use-case";
import { getIntegrationBasicCredentialUseCase } from "@/use-case/integration-basic-credential/get-integration-basic-credential.use-case";
import { listIntegrationBasicCredentialsUseCase } from "@/use-case/integration-basic-credential/list-integration-basic-credentials.use-case";
import { updateIntegrationBasicCredentialUseCase } from "@/use-case/integration-basic-credential/update-integration-basic-credential.use-case";

export const integrationBasicCredentialRouterV1 = () =>
  new Elysia()
    .use(defaultRouterSetup())
    .group("/api/v1/integration-basic-credential", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, headers }) => {
            const authCheckResult = await ctx.guard.authCheck(ctx, headers);

            if (authCheckResult.isErr()) {
              return errEnvelope(authCheckResult.error);
            }
            const createIntegrationBasicCredentialResult =
              await createIntegrationBasicCredentialUseCase(ctx, {
                body,
                user: authCheckResult.value,
              });

            if (createIntegrationBasicCredentialResult.isErr()) {
              return errEnvelope(createIntegrationBasicCredentialResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIntegrationBasicCredentialRequestBodySchema,
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

            const listIntegrationBasicCredentialsResult =
              await listIntegrationBasicCredentialsUseCase(ctx, {
                user: authCheckResult.value,
              });

            if (listIntegrationBasicCredentialsResult.isErr()) {
              return errEnvelope(listIntegrationBasicCredentialsResult.error);
            }

            return okEnvelope({
              data: listIntegrationBasicCredentialsResult.value.map((item) =>
                omit(item, ["password"]),
              ),
            });
          },
          {
            response: withHttpEnvelopeSchema(
              z.array(integrationBasicCredentialResponseDtoSchema),
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

            const getIntegrationBasicCredentialResult =
              await getIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                user: authCheckResult.value,
              });

            if (getIntegrationBasicCredentialResult.isErr()) {
              return errEnvelope(getIntegrationBasicCredentialResult.error);
            }

            return okEnvelope({
              data: omit(getIntegrationBasicCredentialResult.value, [
                "password",
              ]),
            });
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(
              integrationBasicCredentialResponseDtoSchema,
            ),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, headers, params }) => {
            const authCheckResult = await ctx.guard.authCheck(ctx, headers);

            if (authCheckResult.isErr()) {
              return errEnvelope(authCheckResult.error);
            }

            const updateIntegrationBasicCredentialResult =
              await updateIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                body,
                user: authCheckResult.value,
              });

            if (updateIntegrationBasicCredentialResult.isErr()) {
              return errEnvelope(updateIntegrationBasicCredentialResult.error);
            }

            return okEnvelope();
          },
          {
            body: updateIntegrationBasicCredentialRequestBodySchema,
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

            const deleteIntegrationBasicCredentialResult =
              await deleteIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                user: authCheckResult.value,
              });

            if (deleteIntegrationBasicCredentialResult.isErr()) {
              return errEnvelope(deleteIntegrationBasicCredentialResult.error);
            }

            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
