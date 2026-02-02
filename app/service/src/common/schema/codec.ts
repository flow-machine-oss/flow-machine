import { UTCDate } from "@date-fns/utc";
import { err, ok } from "neverthrow";
import z from "zod";
import { Err } from "@/common/err/err";

export const decode = <T extends z.ZodType>(schema: T, data: z.input<T>) => {
  const result = schema.safeDecode(data);
  if (result.success) {
    return ok(result.data);
  }
  return err(Err.from(result.error));
};

export const stringToDateCodec = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new UTCDate(isoString),
  encode: (date) => date.toISOString(),
});
