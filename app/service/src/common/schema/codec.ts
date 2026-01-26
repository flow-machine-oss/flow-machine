import { err, ok } from "neverthrow";
import type z from "zod";
import { Err } from "@/common/err/err";

export const decode = <T extends z.ZodType>(schema: T, data: z.input<T>) => {
  const result = schema.safeDecode(data);
  if (result.success) {
    return ok(result.data);
  }
  return err(Err.from(result.error));
};
