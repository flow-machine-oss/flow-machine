import Elysia from "elysia";
import type { BetterAuthInstance } from "@/adapter/auth/better-auth";

type Input = {
  betterAuth: BetterAuthInstance;
};

export const makeAuthHttpRouter = ({ betterAuth }: Input) =>
  new Elysia({ name: "auth" }).mount(betterAuth.handler);
