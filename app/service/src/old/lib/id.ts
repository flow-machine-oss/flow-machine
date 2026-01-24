import { ulid } from "ulid";
import z from "zod/v4";

export const idSchema = z.ulid();
export type Id = z.infer<typeof idSchema>;
export type IdInput = z.input<typeof idSchema>;

export function newId() {
  return ulid() as Id;
}
