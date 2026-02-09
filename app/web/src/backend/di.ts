import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import { defaultHttpClient } from "@/backend/http-client/shared-http-client";
import { makeAiAgentRouteHandler } from "@/backend/http-route-handler/ai-agent/ai-agent-route-handler";

const aiAgentHttpClient = makeAiAgentHttpClient({
  httpClient: defaultHttpClient,
});

export const aiAgentRouteHandler = makeAiAgentRouteHandler({
  aiAgentHttpClient,
});
