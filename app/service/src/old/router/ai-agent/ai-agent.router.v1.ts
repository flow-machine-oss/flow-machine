import Elysia from "elysia";
import z from "zod";
import { aiAgentResponseDtoSchema } from "@/old/dto/ai-agent/ai-agent.dto";
import { createAiAgentRequestBodySchema } from "@/old/dto/ai-agent/create-ai-agent.dto";
import { updateAiAgentRequestBodySchema } from "@/old/dto/ai-agent/update-ai-agent.dto";
import { idRequestParamsDtoSchema } from "@/old/dto/shared.dto";
import {
  errEnvelope,
  okEnvelope,
  withHttpEnvelopeSchema,
} from "@/old/lib/http";
import { setupAuthGuardPlugin } from "@/old/plugin/setup-auth-guard.plugin";
import { setupBaseCtxPlugin } from "@/old/plugin/setup-ctx.plugin";
import { createAiAgentUseCase } from "@/old/use-case/ai-agent/create-ai-agent.use-case";
import { deleteAiAgentUseCase } from "@/old/use-case/ai-agent/delete-ai-agent.use-case";
import { getAiAgentUseCase } from "@/old/use-case/ai-agent/get-ai-agent.use-case";
import { listAiAgentsUseCase } from "@/old/use-case/ai-agent/list-ai-agents.use-case";
import { updateAiAgentUseCase } from "@/old/use-case/ai-agent/update-ai-agent.use-case";

export const aiAgentRouterV1 = () =>
  new Elysia()
    .use(setupBaseCtxPlugin())
    .use(setupAuthGuardPlugin())
    .group("/api/v1/ai-agent", (r) =>
      r
        .post(
          "",
          async ({ body, ctx, user }) => {
            const createAiAgentResult = await createAiAgentUseCase(ctx, {
              body,
              organizationId: user.organizationId,
            });

            if (createAiAgentResult.isErr()) {
              return errEnvelope(createAiAgentResult.error);
            }
            return okEnvelope();
          },
          {
            body: createAiAgentRequestBodySchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .get(
          "",
          async ({ ctx, user }) => {
            const listAiAgentsResult = await listAiAgentsUseCase(ctx, {
              organizationId: user.organizationId,
            });

            if (listAiAgentsResult.isErr()) {
              return errEnvelope(listAiAgentsResult.error);
            }

            return okEnvelope({ data: listAiAgentsResult.value });
          },
          {
            response: withHttpEnvelopeSchema(z.array(aiAgentResponseDtoSchema)),
          },
        )
        .get(
          "/:id",
          async ({ ctx, params, user }) => {
            const getAiAgentResult = await getAiAgentUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (getAiAgentResult.isErr()) {
              return errEnvelope(getAiAgentResult.error);
            }

            return okEnvelope({ data: getAiAgentResult.value });
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(aiAgentResponseDtoSchema),
          },
        )
        .patch(
          "/:id",
          async ({ body, ctx, params, user }) => {
            const updateAiAgentResult = await updateAiAgentUseCase(ctx, {
              id: params.id,
              body,
              organizationId: user.organizationId,
            });

            if (updateAiAgentResult.isErr()) {
              return errEnvelope(updateAiAgentResult.error);
            }

            return okEnvelope();
          },
          {
            body: updateAiAgentRequestBodySchema,
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        )
        .delete(
          "/:id",
          async ({ ctx, params, user }) => {
            const deleteAiAgentResult = await deleteAiAgentUseCase(ctx, {
              id: params.id,
              organizationId: user.organizationId,
            });

            if (deleteAiAgentResult.isErr()) {
              return errEnvelope(deleteAiAgentResult.error);
            }

            return okEnvelope();
          },
          {
            params: idRequestParamsDtoSchema,
            response: withHttpEnvelopeSchema(z.undefined()),
          },
        ),
    );
