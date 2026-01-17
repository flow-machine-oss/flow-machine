import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import { z } from "zod/v4";
import { config } from "@/lib/config";
import { documentRouterV1 } from "@/router/document/document.router.v1";
import { gitRepositoryRouterV1 } from "@/router/git-repository/git-repository.router.v1";

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
  .use(gitRepositoryRouterV1())
  .listen(8000);
