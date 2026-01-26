import Elysia from "elysia";
import { config } from "@/common/config/config";

export const makeHealthHttpV1Router = () =>
  new Elysia().get("/health", () => ({
    status: "ok",
    version: config.app.version,
    environment: config.app.env,
  }));
