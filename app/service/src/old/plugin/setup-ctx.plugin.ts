import Elysia from "elysia";
import { config } from "@/old/lib/config";
import type { Ctx } from "@/old/lib/ctx";
import { db } from "@/old/lib/db";
import { log } from "@/old/lib/log";

const ctx: Ctx = { config, db, log };

export const setupBaseCtxPlugin = () =>
  new Elysia({ name: "ctx" }).decorate("ctx", ctx);
