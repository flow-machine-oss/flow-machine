import type { AuthCheck } from "@/guard/auth-check.guard";
import type { Config } from "@/lib/config";
import type { Db } from "@/lib/db";
import type { Log } from "@/lib/log";

export type Ctx = {
  config: Config;
  db: Db;
  log: Log;

  guard: {
    authCheck: AuthCheck;
  };
};
