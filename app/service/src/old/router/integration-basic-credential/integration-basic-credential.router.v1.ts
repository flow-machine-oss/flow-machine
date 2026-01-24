import Elysia from "elysia";
import { omit } from "es-toolkit";
import z from "zod";
import { createIntegrationBasicCredentialRequestBodySchema } from "@/old/dto/integration-basic-credential/create-integration-basic-credential.dto";
import { integrationBasicCredentialResponseDtoSchema } from "@/old/dto/integration-basic-credential/integration-basic-credential.dto";
import { updateIntegrationBasicCredentialRequestBodySchema } from "@/old/dto/integration-basic-credential/update-integration-basic-credential.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createIntegrationBasicCredentialUseCase } from "@/old/use-case/integration-basic-credential/create-integration-basic-credential.use-case";
import { deleteIntegrationBasicCredentialUseCase } from "@/old/use-case/integration-basic-credential/delete-integration-basic-credential.use-case";
import { getIntegrationBasicCredentialUseCase } from "@/old/use-case/integration-basic-credential/get-integration-basic-credential.use-case";
import { listIntegrationBasicCredentialsUseCase } from "@/old/use-case/integration-basic-credential/list-integration-basic-credentials.use-case";
import { updateIntegrationBasicCredentialUseCase } from "@/old/use-case/integration-basic-credential/update-integration-basic-credential.use-case";

export const integrationBasicCredentialRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/integration-basic-credential", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createIntegrationBasicCredentialResult =
              await createIntegrationBasicCredentialUseCase(ctx, {
                body,
                organizationId: user.organizationId,
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
          async ({ ctx, user }) => {
            const listIntegrationBasicCredentialsResult =
              await listIntegrationBasicCredentialsUseCase(ctx, {
                organizationId: user.organizationId,
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
          async ({ ctx, params, user }) => {
            const getIntegrationBasicCredentialResult =
              await getIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                organizationId: user.organizationId,
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
          async ({ body, ctx, params, user }) => {
            const updateIntegrationBasicCredentialResult =
              await updateIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                body,
                organizationId: user.organizationId,
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
          async ({ ctx, params, user }) => {
            const deleteIntegrationBasicCredentialResult =
              await deleteIntegrationBasicCredentialUseCase(ctx, {
                id: params.id,
                organizationId: user.organizationId,
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
