import Elysia from "elysia";
import type { InngestFunction } from "inngest";
import { serve } from "inngest/bun";
import { inngest } from "@/adapter/inngest/inngest-client";

type Input = {
  functions: InngestFunction.Any[];
};

export const makeInngestHttpRouter = ({ functions }: Input) => {
  const handler = serve({
    client: inngest,
    functions,
  });

  return new Elysia({ name: "inngest" }).all("/api/inngest", ({ request }) =>
    handler(request),
  );
};
