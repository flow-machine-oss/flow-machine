import { gitRepositoryRouteHandler } from "@/backend/di";

export const GET = gitRepositoryRouteHandler.getById;
export const DELETE = gitRepositoryRouteHandler.deleteById;
export const PATCH = gitRepositoryRouteHandler.updateById;
