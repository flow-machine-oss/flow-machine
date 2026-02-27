import { cors } from "@elysiajs/cors";
import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import z from "zod";
import { config } from "@/common/config/config";
import { makeHttpErrorHandlerPlugin } from "@/common/http/http-error-handler.plugin";
import { authHttpRouter } from "@/di/auth-di";
import { billingHttpV1Router } from "@/di/billing-di";
import { healthHttpV1Router } from "@/di/health-di";
import { inngestHttpRouter } from "@/di/inngest-di";
import { projectHttpV1Router } from "@/di/project-di";
import { workflowActionDefinitionHttpV1Router } from "@/di/workflow-action-definition-di";
import { workflowDefinitionHttpV1Router } from "@/di/workflow-definition-di";
import { aiAgentV1HttpRouterFactory } from "@/v2/di/ai-agent-api";
import { credentialV1HttpRouterFactory } from "@/v2/di/credential-api";
import { documentV1HttpRouterFactory } from "@/v2/di/document-api";
import { gitRepositoryV1HttpRouterFactory } from "@/v2/di/git-repository-api";

const app = new Elysia();

app
  .use(cors())
  .use(
    openapi({
      mapJsonSchema: { zod: z.toJSONSchema },
      references: fromTypes(
        config.app.env === "production" ? "dist/api.d.ts" : "src/api.ts",
      ),
    }),
  )
  .use(makeHttpErrorHandlerPlugin())
  .use(aiAgentV1HttpRouterFactory.make())
  .use(authHttpRouter)
  .use(billingHttpV1Router)
  .use(credentialV1HttpRouterFactory.make())
  .use(documentV1HttpRouterFactory.make())
  .use(gitRepositoryV1HttpRouterFactory.make())
  .use(healthHttpV1Router)
  .use(inngestHttpRouter)
  .use(projectHttpV1Router)
  .use(workflowActionDefinitionHttpV1Router)
  .use(workflowDefinitionHttpV1Router)
  .listen(8000);
