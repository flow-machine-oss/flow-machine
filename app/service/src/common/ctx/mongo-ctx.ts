import { ClientSession } from "mongodb";
import z from "zod";

const mongoCtxSchema = z.object({
  mongoClientSession: z.instanceof(ClientSession).optional(),
});

export { mongoCtxSchema };
