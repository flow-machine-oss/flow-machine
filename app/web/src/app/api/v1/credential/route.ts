import { credentialRouteHandler } from "@/backend/di";

export const GET = credentialRouteHandler.list;
export const POST = credentialRouteHandler.create;
