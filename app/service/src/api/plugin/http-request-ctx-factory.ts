import Elysia from "elysia";
import type { MongoClient } from "mongodb";
import { makeMongoCtx } from "@/common/ctx/mongo-ctx";

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
            ctx: makeMongoCtx(this.#mongoClient),
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
