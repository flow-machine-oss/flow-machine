import openapi, { fromTypes } from "@elysiajs/openapi";
import Elysia from "elysia";
import { z } from "zod/v4";
import { config } from "@/lib/config";

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
  .listen(8000);
