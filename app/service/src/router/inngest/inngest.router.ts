import Elysia from "elysia";
import { serve } from "inngest/bun";
import { inngestClient, inngestFunctions } from "@/inngest/client.inngest";

const handler = serve({
  client: inngestClient,
  functions: inngestFunctions,
});

export const inngestRouter = () =>
  new Elysia().all("/api/inngest", ({ request }) => handler(request));
