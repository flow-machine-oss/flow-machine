import { ClientSession, Db } from "mongodb";
import z from "zod";
import { mongoClient } from "@/common/mongo/mongo-client";
import { config } from "@/old/lib/config";

export const mongoCtxSchema = z.object({
  mongoClientSession: z.instanceof(ClientSession),
  mongoDb: z.instanceof(Db),
});

export type MongoCtx = z.output<typeof mongoCtxSchema>;

export const makeMongoCtx = () =>
  mongoCtxSchema.decode({
    mongoClientSession: mongoClient.startSession(),
    mongoDb: mongoClient.db(config.database.name),
  });
