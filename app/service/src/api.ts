import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import { z } from "zod/v4";
import { config } from "@/lib/config";
import { aiAgentRouterV1 } from "@/router/ai-agent/ai-agent.router.v1";
import { documentRouterV1 } from "@/router/document/document.router.v1";
import { gitRepositoryRouterV1 } from "@/router/git-repository/git-repository.router.v1";
import { inngestRouter } from "@/router/inngest/inngest.router";
import { integrationApiKeyCredentialRouterV1 } from "@/router/integration-api-key-credential/integration-api-key-credential.router.v1";
import { integrationBasicCredentialRouterV1 } from "@/router/integration-basic-credential/integration-basic-credential.router.v1";
import { issueRouterV1 } from "@/router/issue/issue.router.v1";
import { projectRouterV1 } from "@/router/project/project.router.v1";

const app = new Elysia();

app
  .use(
    openapi({
      mapJsonSchema: { zod: z.toJSONSchema },
      references: fromTypes(
        config.app.env === "production" ? "dist/api.d.ts" : "src/api.ts",
      ),
    }),
  )
  .use(aiAgentRouterV1())
  .use(documentRouterV1())
  .use(gitRepositoryRouterV1())
  .use(inngestRouter())
  .use(integrationApiKeyCredentialRouterV1())
  .use(integrationBasicCredentialRouterV1())
  .use(issueRouterV1())
  .use(projectRouterV1())
  .listen(8000);
