import { randomUUIDv7 } from "bun";
import z from "zod";

export const entityIdSchema = z.uuidv7();

export type EntityIdInput = z.input<typeof entityIdSchema>;
export type EntityId = z.output<typeof entityIdSchema>;

export const newEntityId = () => randomUUIDv7() as EntityId;
