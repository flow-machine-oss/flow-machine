import Elysia from "elysia";
import { authCheck } from "@/guard/auth-check.guard";
import { config } from "@/lib/config";
import type { Ctx } from "@/lib/ctx";
import { db } from "@/lib/db";
import { Err } from "@/lib/err";
import { errEnvelope } from "@/lib/http";
import { log } from "@/lib/log";

const ctx: Ctx = { config, db, log, guard: { authCheck } };

export const defaultRouterSetup = () =>
  new Elysia({ name: "setupRoute" })
    .decorate("ctx", ctx)
    .onError({ as: "scoped" }, ({ error }) => {
      return errEnvelope(Err.from(error));
    });
