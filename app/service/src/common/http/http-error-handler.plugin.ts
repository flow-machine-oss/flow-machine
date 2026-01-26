import Elysia from "elysia";
import { Err } from "@/common/err/err";
import { errEnvelope } from "@/common/http/http-envelope";
import { log } from "@/common/log/log";

export const makeHttpErrorHandlerPlugin = () =>
  new Elysia({ name: "errorHandler" }).onError(
    { as: "global" },
    ({ error }) => {
      log.error({ error });
      return errEnvelope(Err.from(error));
    },
  );
