import { config } from "@/old/lib/config";
import type { Ctx } from "@/old/lib/ctx";
import { db } from "@/old/lib/db";
import { log } from "@/old/lib/log";

export const ctx: Ctx = { config, db, log };
