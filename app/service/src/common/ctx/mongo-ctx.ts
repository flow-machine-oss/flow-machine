import { ClientSession, MongoClient } from "mongodb";
import z from "zod";

export const mongoCtxSchema = z.object({
  mongoClientSession: z.instanceof(ClientSession).optional(),
});

export type MongoCtx = z.output<typeof mongoCtxSchema>;

export const makeMongoCtx = (mongoClient: MongoClient) =>
  mongoCtxSchema.decode({
    mongoClientSession: mongoClient.startSession(),
  });
