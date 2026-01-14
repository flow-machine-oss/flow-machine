import { isNil, omitBy } from "es-toolkit";
import type { Err } from "@/lib/err";

type HttpEnvelope<T> = {
  status: number;
  code: string;
  message: string;
  data?: T | undefined;
};

export const okEnvelope = <T>({
  status = 200,
  code = "ok",
  message = "ok",
  data = undefined,
}: Partial<HttpEnvelope<T>> = {}) => {
  return omitBy({ status, code, message, data }, isNil);
};

export const errEnvelope = (err: Err) => {
  return omitBy(
    {
      status: err.status,
      code: err.code,
      message: err.message,
    },
    isNil,
  );
};
