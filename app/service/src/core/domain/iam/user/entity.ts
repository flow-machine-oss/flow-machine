import z from "zod";
import { Entity } from "@/common/domain/entity";
import type { EntityId } from "@/common/domain/entity-id";

const userPropsSchema = z.object({
  email: z.email(),
  emailVerified: z.boolean(),
});
type UserProps = z.output<typeof userPropsSchema>;

class UserEntity extends Entity<UserProps> {
  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    props: UserProps,
  ) {
    return new UserEntity(id, props, {
      createdAt,
      updatedAt,
    });
  }
}

export { UserEntity, userPropsSchema };
