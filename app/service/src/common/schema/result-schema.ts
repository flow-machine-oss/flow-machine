import { Err, Ok } from "neverthrow";
import z from "zod";

export const makeResultSchema = <T extends z.ZodType, K extends z.ZodType>(
  okValueSchema: T,
  errValueSchema: K,
) =>
  z.union([
    z
      .instanceof(Ok<z.output<T>, z.output<K>>)
      .check(z.property("value", okValueSchema)),
    z
      .instanceof(Err<z.output<T>, z.output<K>>)
      .check(z.property("error", errValueSchema)),
  ]);
