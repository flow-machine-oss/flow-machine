import { UTCDate } from "@date-fns/utc";
import z from "zod";

export const stringToDateCodec = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new UTCDate(isoString),
  encode: (date) => date.toISOString(),
});
