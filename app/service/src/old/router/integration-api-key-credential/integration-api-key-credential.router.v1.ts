import Elysia from "elysia";
import z from "zod";
import { createIntegrationApiKeyCredentialRequestBodySchema } from "@/old/dto/integration-api-key-credential/create-integration-api-key-credential.dto";
import { integrationApiKeyCredentialResponseDtoSchema } from "@/old/dto/integration-api-key-credential/integration-api-key-credential.dto";
import { updateIntegrationApiKeyCredentialRequestBodySchema } from "@/old/dto/integration-api-key-credential/update-integration-api-key-credential.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { maskApiKey } from "@/old/lib/util";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createIntegrationApiKeyCredentialUseCase } from "@/old/use-case/integration-api-key-credential/create-integration-api-key-credential.use-case";
import { deleteIntegrationApiKeyCredentialUseCase } from "@/old/use-case/integration-api-key-credential/delete-integration-api-key-credential.use-case";
import { getIntegrationApiKeyCredentialUseCase } from "@/old/use-case/integration-api-key-credential/get-integration-api-key-credential.use-case";
import { listIntegrationApiKeyCredentialsUseCase } from "@/old/use-case/integration-api-key-credential/list-integration-api-key-credentials.use-case";
import { updateIntegrationApiKeyCredentialUseCase } from "@/old/use-case/integration-api-key-credential/update-integration-api-key-credential.use-case";

export const integrationApiKeyCredentialRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/integration-api-key-credential", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createResult = await createIntegrationApiKeyCredentialUseCase(
              ctx,
              {
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
            body: createIntegrationApiKeyCredentialRequestBodySchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .get(
          "",
          async ({ ctx, user }) => {
            const listResult = await listIntegrationApiKeyCredentialsUseCase(
              ctx,
              {
                organizationId: user.organizationId,
              },
            );

            if (listResult.isErr()) {
              return errEnvelope(listResult.error);
            }

            return okEnvelope({
              data: listResult.value.map((credential) => ({
                ...credential,
                apiKey: maskApiKey(credential.apiKey),
              })),
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
          async ({ ctx, params, user }) => {
            const getResult = await getIntegrationApiKeyCredentialUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (getResult.isErr()) {
              return errEnvelope(getResult.error);
            }

            return okEnvelope({
              data: {
                ...getResult.value,
                apiKey: maskApiKey(getResult.value.apiKey),
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
          async ({ body, ctx, params, user }) => {
            const updateResult = await updateIntegrationApiKeyCredentialUseCase(
              ctx,
              {
                id: params.id,
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
            body: updateIntegrationApiKeyCredentialRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteResult = await deleteIntegrationApiKeyCredentialUseCase(
              ctx,
              {
                id: params.id,
                organizationId: user.organizationId,
              },
            );

            if (deleteResult.isErr()) {
              return errEnvelope(deleteResult.error);
            }

            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
