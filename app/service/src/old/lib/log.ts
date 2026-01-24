import pino from "pino";

export const log = pino();
export type Log = typeof log;
