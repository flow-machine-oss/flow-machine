import Elysia from "elysia";
import { makeMongoCtx } from "@/common/ctx/mongo-ctx";

class HttpRequestCtxFactory {
  make() {
    return new Elysia({ name: HttpRequestCtxFactory.name })
      .derive({ as: "scoped" }, () => ({ ctx: makeMongoCtx() }) as const)
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
