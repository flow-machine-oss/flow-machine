import Elysia from "elysia";
import { serve } from "inngest/bun";
import { inngestClient } from "@/client/inngest/inngest.client";
import { workflowFunction } from "@/inngest/function/workflow.function";

const handler = serve({
  client: inngestClient,
  functions: [workflowFunction],
});

export const inngestRouter = () =>
  new Elysia().all("/api/inngest", ({ request }) => handler(request));
