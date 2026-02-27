import Elysia from "elysia";
import { errEnvelope } from "@/api/http-envelope";
import { Err } from "@/common/err/err";
import type { LoggerService } from "@/core/infra/logger/service";

class HttpErrorHandlerFactory {
  #logger: LoggerService;

  constructor(logger: LoggerService) {
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
