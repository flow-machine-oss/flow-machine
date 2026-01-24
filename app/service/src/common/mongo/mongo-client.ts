import { MongoClient } from "mongodb";
import { config } from "@/old/lib/config";

export const mongoClient = new MongoClient(config.database.url);
