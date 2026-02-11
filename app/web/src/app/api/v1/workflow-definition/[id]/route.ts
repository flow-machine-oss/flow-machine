import { workflowDefinitionRouteHandler } from "@/backend/di";

export const GET = workflowDefinitionRouteHandler.getById;
export const DELETE = workflowDefinitionRouteHandler.deleteById;
export const PATCH = workflowDefinitionRouteHandler.updateById;
