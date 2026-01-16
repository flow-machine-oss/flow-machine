import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import { z } from "zod/v4";
import { config } from "@/lib/config";
import { aiAgentRouterV1 } from "@/router/ai-agent/ai-agent.router.v1";
import { documentRouterV1 } from "@/router/document/document.router.v1";

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
  .listen(8000);
