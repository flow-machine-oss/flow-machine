import z from "zod";
import { Entity } from "@/core/domain/entity";
import { type EntityId, entityIdSchema } from "@/core/domain/entity";

const sessionPropsSchema = z.object({
  userId: entityIdSchema,
  activeOrganizationId: entityIdSchema.nullable(),
  expiresAt: z.date(),
});
type SessionProps = z.output<typeof sessionPropsSchema>;

class SessionEntity extends Entity<SessionProps> {
  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    props: SessionProps,
  ) {
    return new SessionEntity(id, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { SessionEntity, sessionPropsSchema };
