import Elysia from "elysia";
import type { MongoClient } from "mongodb";

class HttpRequestCtxFactory {
  #mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.#mongoClient = mongoClient;
  }

  make() {
    return new Elysia({ name: HttpRequestCtxFactory.name }).derive(
      { as: "scoped" },
      () =>
        ({
          ctx: {
            mongoClient: this.#mongoClient,
            mongoClientSession: undefined,
          },
        }) as const,
    );
  }
}

export { HttpRequestCtxFactory };
