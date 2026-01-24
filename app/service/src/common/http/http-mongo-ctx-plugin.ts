import Elysia from "elysia";
import { makeMongoCtx } from "@/common/ctx/mongo-ctx";

export const makeHttpMongoCtxPlugin = () =>
  new Elysia({ name: "mongoCtx" })
    .decorate("ctx", makeMongoCtx())
    .onBeforeHandle({ as: "scoped" }, async ({ ctx }) => {
      console.log("setupMongoCtxPlugin beforeHandle");
      ctx.mongoClientSession.startTransaction();
    })
    .onAfterHandle({ as: "scoped" }, async ({ ctx }) => {
      console.log("setupMongoCtxPlugin afterHandle");
      await ctx.mongoClientSession.commitTransaction();
    })
    .onError({ as: "scoped" }, async ({ ctx }) => {
      console.log("setupMongoCtxPlugin onError");
      await ctx.mongoClientSession.abortTransaction();
    })
    .onAfterResponse({ as: "scoped" }, async ({ ctx }) => {
      console.log("setupMongoCtxPlugin afterResponse");
      await ctx.mongoClientSession.endSession();
    });
