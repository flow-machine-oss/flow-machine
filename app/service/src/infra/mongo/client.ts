import { MongoClient } from "mongodb";
import type { ConfigService } from "@/core/infra/config/service";

class MongoClientFactory {
  #configService: ConfigService;

  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  make() {
    return new MongoClient(this.#configService.get("database.url"));
  }
}

export { MongoClientFactory };
