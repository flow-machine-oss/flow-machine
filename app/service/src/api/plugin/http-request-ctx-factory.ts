import Elysia from "elysia";
import type { MongoClient } from "mongodb";
import { makeMongoCtx } from "@/common/ctx/mongo-ctx";
import type { ConfigService } from "@/core/infra/config/service";

class HttpRequestCtxFactory {
  #mongoClient: MongoClient;
  #configService: ConfigService;

  constructor(mongoClient: MongoClient, configService: ConfigService) {
    this.#mongoClient = mongoClient;
    this.#configService = configService;
  }

  make() {
    return new Elysia({ name: HttpRequestCtxFactory.name })
      .derive(
        { as: "scoped" },
        () =>
          ({
            ctx: makeMongoCtx(
              this.#mongoClient,
              this.#configService.get("database.name"),
            ),
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
