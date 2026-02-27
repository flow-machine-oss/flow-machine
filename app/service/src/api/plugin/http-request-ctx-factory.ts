import Elysia from "elysia";
import type { MongoClient } from "mongodb";

class HttpRequestCtxFactory {
  #mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.#mongoClient = mongoClient;
  }

  make() {
    return new Elysia({ name: HttpRequestCtxFactory.name })
      .derive(
        { as: "scoped" },
        () =>
          ({
            ctx: { mongoClientSession: this.#mongoClient.startSession() },
          }) as const,
      )
      .onBeforeHandle({ as: "scoped" }, async ({ ctx }) => {
        ctx.mongoClientSession?.startTransaction();
      })
      .onAfterHandle({ as: "scoped" }, async ({ ctx }) => {
        await ctx.mongoClientSession?.commitTransaction();
      })
      .onError({ as: "scoped" }, async ({ ctx }) => {
        await ctx?.mongoClientSession?.abortTransaction();
      })
      .onAfterResponse({ as: "scoped" }, async ({ ctx }) => {
        await ctx.mongoClientSession?.endSession();
      });
  }
}

export { HttpRequestCtxFactory };
