import { MongoClient } from "mongodb";
import { config } from "@/common/config/config";

export const mongoClient = new MongoClient(config.database.url);
