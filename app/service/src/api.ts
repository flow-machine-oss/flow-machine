import { cors } from "@elysiajs/cors";
import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import z from "zod";
import { config } from "@/common/config/config";
import { makeHttpErrorHandlerPlugin } from "@/common/http/http-error-handler.plugin";
import { authHttpRouter } from "@/di/auth-di";
import { documentHttpV1Router } from "@/di/document-di";
import { healthHttpV1Router } from "@/di/health-di";
import { inngestHttpRouter } from "@/di/inngest-di";
import { workflowHttpV1Router } from "@/di/workflow-di";

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
  .use(authHttpRouter)
  .use(documentHttpV1Router)
  .use(healthHttpV1Router)
  .use(inngestHttpRouter)
  .use(workflowHttpV1Router)
  .listen(8000);
