import { aiAgentRouteHandler } from "@/backend/di";

export const GET = aiAgentRouteHandler.getById;
export const DELETE = aiAgentRouteHandler.deleteById;
export const PATCH = aiAgentRouteHandler.updateById;
