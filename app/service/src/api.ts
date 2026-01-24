import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import z from "zod";
import { config } from "@/common/config/config";
import { makeHttpErrorHandlerPlugin } from "@/common/http/http-error-handler.plugin";
import { documentHttpV1Router } from "@/di/document-di";

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
  .use(makeHttpErrorHandlerPlugin())
  .use(documentHttpV1Router)
  .listen(8000);
