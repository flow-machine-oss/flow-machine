import { Daytona } from "@daytonaio/sdk";
import type { ConfigService } from "@/core/infra/config/service";

class DaytonaClientFactory {
  #configService: ConfigService;

  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  make() {
    return new Daytona({
      apiKey: this.#configService.get("daytona.apiKey"),
    });
  }
}

export { DaytonaClientFactory };
