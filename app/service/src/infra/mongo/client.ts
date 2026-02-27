import { MongoClient } from "mongodb";
import { config } from "@/common/config/config";
import type { ConfigService } from "@/core/infra/config/service";

export const mongoClient = new MongoClient(config.database.url);

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
