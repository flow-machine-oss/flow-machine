import { ClientSession, Db, MongoClient } from "mongodb";
import z from "zod";

export const mongoCtxSchema = z.object({
  mongoClientSession: z.instanceof(ClientSession).optional(),
  mongoDb: z.instanceof(Db),
});

export type MongoCtx = z.output<typeof mongoCtxSchema>;

export const makeMongoCtx = (mongoClient: MongoClient, databaseName: string) =>
  mongoCtxSchema.decode({
    mongoClientSession: mongoClient.startSession(),
    mongoDb: mongoClient.db(databaseName),
  });
