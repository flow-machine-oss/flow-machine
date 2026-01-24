import type { Config } from "@/old/lib/config";
import type { Db } from "@/old/lib/db";
import type { Log } from "@/old/lib/log";

export type Ctx = {
  config: Config;
  db: Db;
  log: Log;
};
