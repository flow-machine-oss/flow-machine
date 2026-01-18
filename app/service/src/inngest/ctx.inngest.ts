import { authCheck } from "@/guard/auth-check.guard";
import { config } from "@/lib/config";
import type { Ctx } from "@/lib/ctx";
import { db } from "@/lib/db";
import { log } from "@/lib/log";

export const ctx: Ctx = { config, db, log, guard: { authCheck } };
