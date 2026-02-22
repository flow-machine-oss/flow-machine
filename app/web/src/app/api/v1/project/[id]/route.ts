import { projectRouteHandler } from "@/backend/di";

export const GET = projectRouteHandler.getById;
export const DELETE = projectRouteHandler.deleteById;
export const PATCH = projectRouteHandler.updateById;
