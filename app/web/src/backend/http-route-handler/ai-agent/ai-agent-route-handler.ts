import { NextRequest, NextResponse } from "next/server";
import type { AiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import { aiAgentDomainCodec } from "@/backend/http-route-handler/ai-agent/ai-agent-route-handler-codec";
import { type HttpEnvelope, okHttpEnvelope } from "@/common/http/http-schema";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import {
  createAiAgentServicePortInSchema,
  deleteAiAgentServicePortInSchema,
  getAiAgentServicePortInSchema,
  updateAiAgentServicePortInSchema,
} from "@/domain/port/ai-agent/ai-agent-service-port";

type MakeAiAgentRouteHandlerIn = {
  aiAgentHttpClient: AiAgentHttpClient;
};

export const makeAiAgentRouteHandler = ({
  aiAgentHttpClient,
}: MakeAiAgentRouteHandlerIn) => ({
  create: async (request: NextRequest) => {
    const body = await request.json();

    const { body: payload } = createAiAgentServicePortInSchema.parse({ body });

    await aiAgentHttpClient.create({ payload });

    return NextResponse.json(okHttpEnvelope());
  },

  deleteById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/ai-agent/[id]">,
  ) => {
    const params = await ctx.params;

    const validatedInput = deleteAiAgentServicePortInSchema.parse({ params });

    await aiAgentHttpClient.deleteById({
      payload: { id: validatedInput.params.id },
    });

    return NextResponse.json(okHttpEnvelope());
  },

  getById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/ai-agent/[id]">,
  ): Promise<NextResponse<HttpEnvelope<AiAgentDomain>>> => {
    const params = await ctx.params;

    const validatedInput = getAiAgentServicePortInSchema.parse({ params });

    const response = await aiAgentHttpClient.getById({
      payload: { id: validatedInput.params.id },
    });
    const data = aiAgentDomainCodec.decode(response.data);

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  list: async (): Promise<NextResponse<HttpEnvelope<AiAgentDomain[]>>> => {
    const listAiAgentsClientResponse = await aiAgentHttpClient.list();

    const data = listAiAgentsClientResponse.data.map((item) =>
      aiAgentDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  updateById: async (
    request: NextRequest,
    ctx: RouteContext<"/api/v1/ai-agent/[id]">,
  ) => {
    const body = await request.json();
    const params = await ctx.params;

    const validatedInput = updateAiAgentServicePortInSchema.parse({
      body,
      params,
    });
    await aiAgentHttpClient.updateById({
      payload: {
        id: validatedInput.params.id,
        body: validatedInput.body,
      },
    });

    return NextResponse.json(okHttpEnvelope());
  },
});
