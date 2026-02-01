import Elysia from "elysia";
import {
  type AiAgentResponseDto,
  idParamsDtoSchema,
  patchAiAgentRequestBodyDtoSchema,
  postAiAgentRequestBodyDtoSchema,
} from "@/adapter/http/ai-agent/ai-agent-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  CreateAiAgentUseCase,
  DeleteAiAgentUseCase,
  GetAiAgentUseCase,
  ListAiAgentsUseCase,
  UpdateAiAgentUseCase,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  createAiAgentUseCase: CreateAiAgentUseCase;
  deleteAiAgentUseCase: DeleteAiAgentUseCase;
  getAiAgentUseCase: GetAiAgentUseCase;
  listAiAgentsUseCase: ListAiAgentsUseCase;
  updateAiAgentUseCase: UpdateAiAgentUseCase;
};

const toResponseDto = (entity: AiAgentEntity): AiAgentResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  tenant: entity.tenant,
  name: entity.props.name,
  model: entity.props.model,
});

export const makeAiAgentHttpV1Router = ({
  getSession,
  getActiveMember,
  createAiAgentUseCase,
  deleteAiAgentUseCase,
  getAiAgentUseCase,
  listAiAgentsUseCase,
  updateAiAgentUseCase,
}: Input) =>
  new Elysia({ name: "ai-agent.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/ai-agent", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, tenant }) => {
            const result = await createAiAgentUseCase({
              ctx: { ...ctx, tenant },
              payload: body,
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: postAiAgentRequestBodyDtoSchema,
          },
        )
        .get("", async ({ ctx, tenant }) => {
          const result = await listAiAgentsUseCase({
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
            const result = await getAiAgentUseCase({
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
            const result = await updateAiAgentUseCase({
              ctx: { ...ctx, tenant },
              payload: {
                id: params.id,
                name: body.name,
                model: body.model,
              },
            });
            if (result.isErr()) {
              return errEnvelope(result.error);
            }
            return okEnvelope();
          },
          {
            body: patchAiAgentRequestBodyDtoSchema,
            params: idParamsDtoSchema,
          },
        )
        .delete(
          "/:id",
          async ({ ctx, tenant, params }) => {
            const result = await deleteAiAgentUseCase({
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
