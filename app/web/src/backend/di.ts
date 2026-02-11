import { makeAiAgentHttpClient } from "@/backend/http-client/ai-agent/ai-agent-http-client";
import { makeGitRepositoryHttpClient } from "@/backend/http-client/git-repository/git-repository-http-client";
import { defaultHttpClient } from "@/backend/http-client/shared-http-client";
import { makeWorkflowActionDefinitionHttpClient } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client";
import { makeWorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import { makeAiAgentRouteHandler } from "@/backend/http-route-handler/ai-agent/ai-agent-route-handler";
import { makeGitRepositoryRouteHandler } from "@/backend/http-route-handler/git-repository/git-repository-route-handler";
import { makeWorkflowActionDefinitionRouteHandler } from "@/backend/http-route-handler/workflow-action-definition/workflow-action-definition-route-handler";
import { makeWorkflowDefinitionRouteHandler } from "@/backend/http-route-handler/workflow-definition/workflow-definition-route-handler";

const aiAgentHttpClient = makeAiAgentHttpClient({
  httpClient: defaultHttpClient,
});

export const aiAgentRouteHandler = makeAiAgentRouteHandler({
  aiAgentHttpClient,
});

const gitRepositoryHttpClient = makeGitRepositoryHttpClient({
  httpClient: defaultHttpClient,
});

export const gitRepositoryRouteHandler = makeGitRepositoryRouteHandler({
  gitRepositoryHttpClient,
});

const workflowDefinitionHttpClient = makeWorkflowDefinitionHttpClient({
  httpClient: defaultHttpClient,
});

export const workflowDefinitionRouteHandler =
  makeWorkflowDefinitionRouteHandler({
    workflowDefinitionHttpClient,
  });

const workflowActionDefinitionHttpClient =
  makeWorkflowActionDefinitionHttpClient({
    httpClient: defaultHttpClient,
  });

export const workflowActionDefinitionRouteHandler =
  makeWorkflowActionDefinitionRouteHandler({
    workflowActionDefinitionHttpClient,
  });
