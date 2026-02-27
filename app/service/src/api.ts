import { cors } from "@elysiajs/cors";
import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import z from "zod";
import { config } from "@/common/config/config";
import { aiAgentV1HttpRouterFactory } from "@/di/ai-agent-api";
import { betterAuthHttpRouterFactory } from "@/di/auth-api";
import { credentialV1HttpRouterFactory } from "@/di/credential-api";
import { documentV1HttpRouterFactory } from "@/di/document-api";
import { gitRepositoryV1HttpRouterFactory } from "@/di/git-repository-api";
import { healthHttpRouterFactory } from "@/di/health-api";
import { inngestHttpRouterFactory } from "@/di/inngest-api";
import { projectV1HttpRouterFactory } from "@/di/project-api";
import { httpErrorHandlerFactory } from "@/di/shared";
import { workflowActionDefinitionV1HttpRouterFactory } from "@/di/workflow-action-definition-api";
import { workflowDefinitionV1HttpRouterFactory } from "@/di/workflow-definition-api";

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
  .use(httpErrorHandlerFactory.make())
  .use(aiAgentV1HttpRouterFactory.make())
  .use(betterAuthHttpRouterFactory.make())
  .use(credentialV1HttpRouterFactory.make())
  .use(documentV1HttpRouterFactory.make())
  .use(gitRepositoryV1HttpRouterFactory.make())
  .use(healthHttpRouterFactory.make())
  .use(inngestHttpRouterFactory.make())
  .use(projectV1HttpRouterFactory.make())
  .use(workflowActionDefinitionV1HttpRouterFactory.make())
  .use(workflowDefinitionV1HttpRouterFactory.make())
  .listen(8000);
