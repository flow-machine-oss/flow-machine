import Elysia from "elysia";
import z from "zod";
import { aiAgentResponseDtoSchema } from "@/dto/ai-agent/ai-agent.dto";
import { createAiAgentRequestBodySchema } from "@/dto/ai-agent/create-ai-agent.dto";
import { updateAiAgentRequestBodySchema } from "@/dto/ai-agent/update-ai-agent.dto";
import { idRequestParamsDtoSchema } from "@/dto/shared.dto";
import { errEnvelope, okEnvelope, withHttpEnvelopeSchema } from "@/lib/http";
import { defaultRouterSetup } from "@/middleware/default-router-setup.middleware";
import { createAiAgentUseCase } from "@/use-case/ai-agent/create-ai-agent.use-case";
import { deleteAiAgentUseCase } from "@/use-case/ai-agent/delete-ai-agent.use-case";
import { getAiAgentUseCase } from "@/use-case/ai-agent/get-ai-agent.use-case";
import { listAiAgentsUseCase } from "@/use-case/ai-agent/list-ai-agents.use-case";
import { updateAiAgentUseCase } from "@/use-case/ai-agent/update-ai-agent.use-case";

export const aiAgentRouterV1 = () =>
  new Elysia().use(defaultRouterSetup()).group("/api/v1/ai-agent", (r) =>
    r
      .post(
        "",
        async ({ body, ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }
          const createAiAgentResult = await createAiAgentUseCase(ctx, {
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const listAiAgentsResult = await listAiAgentsUseCase(ctx, {
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const getAiAgentResult = await getAiAgentUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
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
        async ({ body, ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const updateAiAgentResult = await updateAiAgentUseCase(ctx, {
            id: params.id,
            body,
            user: authCheckResult.value,
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
        async ({ ctx, headers, params }) => {
          const authCheckResult = await ctx.guard.authCheck(ctx, headers);

          if (authCheckResult.isErr()) {
            return errEnvelope(authCheckResult.error);
          }

          const deleteAiAgentResult = await deleteAiAgentUseCase(ctx, {
            id: params.id,
            user: authCheckResult.value,
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
