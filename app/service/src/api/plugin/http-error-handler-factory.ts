import Elysia from "elysia";
import type pino from "pino";
import { errEnvelope } from "@/api/http-envelope";
import { Err } from "@/common/err/err";

class HttpErrorHandlerFactory {
  #logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.#logger = logger;
  }

  make() {
    return new Elysia({ name: HttpErrorHandlerFactory.name }).onError(
      { as: "global" },
      ({ error }) => {
        this.#logger.error({ error });
        return errEnvelope(Err.from(error));
      },
    );
  }
}

export { HttpErrorHandlerFactory };
