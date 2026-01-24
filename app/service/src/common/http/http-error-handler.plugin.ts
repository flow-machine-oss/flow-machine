import Elysia from "elysia";
import { Err } from "@/common/err/err";
import { errEnvelope } from "@/common/http/http-envelope";

export const makeHttpErrorHandlerPlugin = () =>
  new Elysia({ name: "errorHandler" }).onError(
    { as: "global" },
    ({ error }) => {
      console.log("setupErrorHandlerPlugin afterHandle");
      return errEnvelope(Err.from(error));
    },
  );
