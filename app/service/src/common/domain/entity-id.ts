import { ulid } from "ulid";
import z from "zod";

export const entityIdSchema = z.ulid();

export type EntityIdInput = z.input<typeof entityIdSchema>;
export type EntityId = z.output<typeof entityIdSchema>;

export const newEntityId = () => ulid() as EntityId;
