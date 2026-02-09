import { NextRequest, NextResponse } from "next/server";
import type { AiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import { aiAgentDomainCodec } from "@/backend/http-route-handler/ai-agent/ai-agent-route-handler-codec";
import { type HttpEnvelope, okHttpEnvelope } from "@/common/http/http-schema";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";

type MakeAiAgentRouteHandlerIn = {
  aiAgentHttpClient: AiAgentHttpClient;
};

export const makeAiAgentRouteHandler = ({
  aiAgentHttpClient,
}: MakeAiAgentRouteHandlerIn) => ({
  create: (request: NextRequest) => {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  },

  deleteById: (request: NextRequest, ctx: RouteContext<"/ai-agent/[id]">) => {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  },

  getById: (request: NextRequest, ctx: RouteContext<"/ai-agent/[id]">) => {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  },

  list: async (): Promise<NextResponse<HttpEnvelope<AiAgentDomain[]>>> => {
    const listAiAgentsClientResponse = await aiAgentHttpClient.list();

    const data = listAiAgentsClientResponse.data.map((item) =>
      aiAgentDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  updateById: (request: NextRequest, ctx: RouteContext<"/ai-agent/[id]">) => {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  },
});
