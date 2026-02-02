import Elysia from "elysia";
import {
  type CredentialResponseDto,
  idParamsDtoSchema,
  patchCredentialRequestBodyDtoSchema,
  postCredentialRequestBodyDtoSchema,
} from "@/adapter/http/credential/credential-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateCredentialUseCase,
  DeleteCredentialUseCase,
  GetCredentialUseCase,
  ListCredentialsUseCase,
  UpdateCredentialUseCase,
} from "@/domain/port/credential/credential-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createCredentialUseCase: CreateCredentialUseCase;
  deleteCredentialUseCase: DeleteCredentialUseCase;
  getCredentialUseCase: GetCredentialUseCase;
  listCredentialsUseCase: ListCredentialsUseCase;
  updateCredentialUseCase: UpdateCredentialUseCase;
};

const toResponseDto = (entity: CredentialEntity): CredentialResponseDto => {
  const base = {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    tenant: entity.tenant,
    expiredAt: entity.props.expiredAt,
  };

  if (entity.props.type === "apiKey") {
    return {
      ...base,
      type: "apiKey",
    };
  }

  return {
    ...base,
    type: "basic",
    username: entity.props.username,
  };
};

export const makeCredentialHttpV1Router = ({
  getSession,
  getActiveMember,
  createCredentialUseCase,
  deleteCredentialUseCase,
  getCredentialUseCase,
  listCredentialsUseCase,
  updateCredentialUseCase,
}: Input) =>
  new Elysia({ name: "credential.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/credential", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createCredentialUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postCredentialRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listCredentialsUseCase({
            ctx: { ...ctx, tenant },
          });
          if (result.isErr()) {
            return errEnvelope(result.error);
          }
          return okEnvelope({ data: result.value.map(toResponseDto) });
        })
        .get(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await getCredentialUseCase({
              ctx: { ...ctx, tenant },
              payload: { id: params.id },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope({ data: toResponseDto(result.value) });
          },
          {
            params: idParamsDtoSchema,
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, tenant, params }) => {
            const result = await updateCredentialUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                data: body,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchCredentialRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteCredentialUseCase({
              ctx: { ...ctx, tenant },
              payload: { id: params.id },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            params: idParamsDtoSchema,
          },
        ),
    );
