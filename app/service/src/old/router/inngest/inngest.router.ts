import Elysia from "elysia";
import { serve } from "inngest/bun";
import { inngestClient } from "@/old/client/inngest.client";
import { workflowFunction } from "@/old/inngest/function/workflow.function";

const handler = serve({
  client: inngestClient,
  functions: [workflowFunction],
});

export const inngestRouter = () =>
  new Elysia().all("/api/inngest", ({ request }) => handler(request));
