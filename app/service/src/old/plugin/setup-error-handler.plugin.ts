import Elysia from "elysia";
import { Err } from "@/old/lib/err";
import { errEnvelope } from "@/old/lib/http";

export const setupErrorHandlerPlugin = () =>
  new Elysia({ name: "errorHandler" }).onError(
    { as: "global" },
    ({ error }) => {
      console.error(error);
      return errEnvelope(Err.from(error));
    },
  );
