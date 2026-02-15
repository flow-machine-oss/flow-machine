import { gitRepositoryRouteHandler } from "@/backend/di";

export const GET = gitRepositoryRouteHandler.list;
export const POST = gitRepositoryRouteHandler.create;
