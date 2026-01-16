import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import { z } from "zod/v4";
import { config } from "@/lib/config";
import { documentRouterV1 } from "@/router/document/document.router.v1";
import { integrationApiKeyCredentialRouterV1 } from "@/router/integration-api-key-credential/integration-api-key-credential.router.v1";
import { integrationBasicCredentialRouterV1 } from "@/router/integration-basic-credential/integration-basic-credential.router.v1";

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
  .use(documentRouterV1())
  .use(integrationApiKeyCredentialRouterV1())
  .use(integrationBasicCredentialRouterV1())
  .listen(8000);
