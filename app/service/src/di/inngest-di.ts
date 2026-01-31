import { makeInngestHttpRouter } from "@/adapter/http/inngest/inngest-http-router";
import { makeWorkflowEngine } from "@/adapter/inngest/workflow-engine";
import { makeWorkflowFunction } from "@/adapter/inngest/workflow-function";
import { findWorkflowDefinitionByIdMongoRepository } from "@/di/workflow-definition-di";

// Workflow engine
const workflowEngine = makeWorkflowEngine({
  findWorkflowDefinitionByIdRepository:
    findWorkflowDefinitionByIdMongoRepository,
});

// Inngest functions
const workflowFunction = makeWorkflowFunction({ workflowEngine });

export const inngestHttpRouter = makeInngestHttpRouter({
  functions: [workflowFunction],
});
