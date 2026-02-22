import { credentialRouteHandler } from "@/backend/di";

export const GET = credentialRouteHandler.getById;
export const DELETE = credentialRouteHandler.deleteById;
export const PATCH = credentialRouteHandler.updateById;
