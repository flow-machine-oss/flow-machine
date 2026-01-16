import Elysia from "elysia";
import z from "zod";
import { createIntegrationApiKeyCredentialRequestBodySchema } from "@/dto/integration-api-key-credential/create-integration-api-key-credential.dto";
import { integrationApiKeyCredentialResponseDtoSchema } from "@/dto/integration-api-key-credential/integration-api-key-credential.dto";
import { updateIntegrationApiKeyCredentialRequestBodySchema } from "@/dto/integration-api-key-credential/update-integration-api-key-credential.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { maskApiKey } from "@/lib/util";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createIntegrationApiKeyCredentialUseCase } from "@/use-case/integration-api-key-credential/create-integration-api-key-credential.use-case";
import { deleteIntegrationApiKeyCredentialUseCase } from "@/use-case/integration-api-key-credential/delete-integration-api-key-credential.use-case";
import { getIntegrationApiKeyCredentialUseCase } from "@/use-case/integration-api-key-credential/get-integration-api-key-credential.use-case";
import { listIntegrationApiKeyCredentialsUseCase } from "@/use-case/integration-api-key-credential/list-integration-api-key-credentials.use-case";
import { updateIntegrationApiKeyCredentialUseCase } from "@/use-case/integration-api-key-credential/update-integration-api-key-credential.use-case";

export const integrationApiKeyCredentialRouterV1 = () =>
  new Elysia()
    .use(defaultRouterSetup())
    .group("/api/v1/integration-api-key-credential", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, headers }) => {
            const authCheckResult = await ctx.guard.authCheck(ctx, headers);

            if (authCheckResult.isErr()) {
              return errEnvelope(authCheckResult.error);
            }
            const createIntegrationApiKeyCredentialResult =
              await createIntegrationApiKeyCredentialUseCase(ctx, {
                body,
                user: authCheckResult.value,
              });

            if (createIntegrationApiKeyCredentialResult.isErr()) {
              return errEnvelope(createIntegrationApiKeyCredentialResult.error);
            }
            return okEnvelope();
          },
          {
            body: createIntegrationApiKeyCredentialRequestBodySchema,
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

            const listIntegrationApiKeyCredentialsResult =
              await listIntegrationApiKeyCredentialsUseCase(ctx, {
                user: authCheckResult.value,
              });

            if (listIntegrationApiKeyCredentialsResult.isErr()) {
              return errEnvelope(listIntegrationApiKeyCredentialsResult.error);
            }

            return okEnvelope({
              data: listIntegrationApiKeyCredentialsResult.value.map(
                (credential) => ({
                  ...credential,
                  apiKey: maskApiKey(credential.apiKey),
                }),
              ),
            });
          },
          {
            response: withHttpEnvelopeSchema(
              z.array(integrationApiKeyCredentialResponseDtoSchema),
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

            const getIntegrationApiKeyCredentialResult =
              await getIntegrationApiKeyCredentialUseCase(ctx, {
                id: params.id,
                user: authCheckResult.value,
              });

            if (getIntegrationApiKeyCredentialResult.isErr()) {
              return errEnvelope(getIntegrationApiKeyCredentialResult.error);
            }

            return okEnvelope({
              data: {
                ...getIntegrationApiKeyCredentialResult.value,
                apiKey: maskApiKey(
                  getIntegrationApiKeyCredentialResult.value.apiKey,
                ),
              },
            });
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(
              integrationApiKeyCredentialResponseDtoSchema,
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

            const updateIntegrationApiKeyCredentialResult =
              await updateIntegrationApiKeyCredentialUseCase(ctx, {
                id: params.id,
                body,
                user: authCheckResult.value,
              });

            if (updateIntegrationApiKeyCredentialResult.isErr()) {
              return errEnvelope(updateIntegrationApiKeyCredentialResult.error);
            }

            return okEnvelope();
          },
          {
            body: updateIntegrationApiKeyCredentialRequestBodySchema,
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

            const deleteIntegrationApiKeyCredentialResult =
              await deleteIntegrationApiKeyCredentialUseCase(ctx, {
                id: params.id,
                user: authCheckResult.value,
              });

            if (deleteIntegrationApiKeyCredentialResult.isErr()) {
              return errEnvelope(deleteIntegrationApiKeyCredentialResult.error);
            }

            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
