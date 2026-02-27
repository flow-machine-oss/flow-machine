import z from "zod";
import { Entity } from "@/common/domain/entity";
import { type EntityId, entityIdSchema } from "@/common/domain/entity-id";

const memberPropsSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
  userId: entityIdSchema,
  organizationId: entityIdSchema,
});
type MemberProps = z.output<typeof memberPropsSchema>;

class MemberEntity extends Entity<MemberProps> {
  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    props: MemberProps,
  ) {
    return new MemberEntity(id, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { MemberEntity, memberPropsSchema };
