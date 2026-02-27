import { cors } from "@elysiajs/cors";
import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import z from "zod";
import { config } from "@/common/config/config";
import { makeHttpErrorHandlerPlugin } from "@/common/http/http-error-handler.plugin";
import { aiAgentV1HttpRouterFactory } from "@/v2/di/ai-agent-api";
import { betterAuthHttpRouterFactory } from "@/v2/di/auth-api";
import { credentialV1HttpRouterFactory } from "@/v2/di/credential-api";
import { documentV1HttpRouterFactory } from "@/v2/di/document-api";
import { gitRepositoryV1HttpRouterFactory } from "@/v2/di/git-repository-api";
import { healthHttpRouterFactory } from "@/v2/di/health-api";
import { inngestHttpRouterFactory } from "@/v2/di/inngest-api";
import { projectV1HttpRouterFactory } from "@/v2/di/project-api";
import { workflowDefinitionActionV1HttpRouterFactory } from "@/v2/di/workflow-definition-action-api";
import { workflowDefinitionV1HttpRouterFactory } from "@/v2/di/workflow-definition-api";

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
  .use(betterAuthHttpRouterFactory.make())
  .use(credentialV1HttpRouterFactory.make())
  .use(documentV1HttpRouterFactory.make())
  .use(gitRepositoryV1HttpRouterFactory.make())
  .use(healthHttpRouterFactory.make())
  .use(inngestHttpRouterFactory.make())
  .use(projectV1HttpRouterFactory.make())
  .use(workflowDefinitionActionV1HttpRouterFactory.make())
  .use(workflowDefinitionV1HttpRouterFactory.make())
  .listen(8000);
