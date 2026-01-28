import { makeInngestHttpRouter } from "@/adapter/http/inngest/inngest-http-router";
import { makeWorkflowEngine } from "@/adapter/inngest/workflow-engine";
import { makeWorkflowFunction } from "@/adapter/inngest/workflow-function";
import { findWorkflowByIdMongoRepository } from "@/di/workflow-di";

// Workflow engine
const workflowEngine = makeWorkflowEngine({
  findWorkflowByIdRepository: findWorkflowByIdMongoRepository,
});

// Inngest functions
const workflowFunction = makeWorkflowFunction({ workflowEngine });

export const inngestHttpRouter = makeInngestHttpRouter({
  functions: [workflowFunction],
});
