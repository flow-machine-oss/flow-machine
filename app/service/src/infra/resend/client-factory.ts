import { Resend } from "resend";
import type { ConfigService } from "@/core/infra/config/service";

class ResendClientFactory {
  #configService: ConfigService;

  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  make() {
    return new Resend(this.#configService.get("email.apiKey"));
  }
}

export { ResendClientFactory };
