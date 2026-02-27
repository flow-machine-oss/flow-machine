import { ClientSession, Db } from "mongodb";
import z from "zod";
import { config } from "@/common/config/config";
import { mongoClient } from "@/common/mongo/mongo-client";

export const mongoCtxSchema = z.object({
  mongoClientSession: z.instanceof(ClientSession).optional(),
  mongoDb: z.instanceof(Db),
});

export type MongoCtx = z.output<typeof mongoCtxSchema>;

export const makeMongoCtx = () =>
  mongoCtxSchema.decode({
    mongoClientSession: mongoClient.startSession(),
    mongoDb: mongoClient.db(config.database.name),
  });
