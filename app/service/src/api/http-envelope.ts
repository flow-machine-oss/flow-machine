import { isNil, omitBy } from "es-toolkit";
import z from "zod";
import type { Err } from "@/common/err/err";

type HttpEnvelope<T> = {
  status: number;
  code: string;
  message: string;
  data?: T | undefined;
};

export const okEnvelope = <T = undefined>({
  status = 200,
  code = "ok",
  message = "ok",
  data = undefined,
}: Partial<HttpEnvelope<T>> = {}) => {
  return omitBy({ status, code, message, data }, isNil) as HttpEnvelope<T>;
};

export const errEnvelope = (err: Err) => {
  return {
    status: err.status,
    code: err.code,
    message: err.message,
  } as const;
};

export const withHttpEnvelopeSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    status: z.number(),
    code: z.string(),
    message: z.string(),
    data: schema.optional(),
  });
