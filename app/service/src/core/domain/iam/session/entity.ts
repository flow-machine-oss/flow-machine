import z from "zod";
import { Entity } from "@/common/domain/entity";
import { type EntityId, entityIdSchema } from "@/common/domain/entity-id";

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
