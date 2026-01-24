import { UTCDate } from "@date-fns/utc";
import type { EmptyObject, UnknownRecord } from "type-fest";
import type { EntityId } from "@/common/domain/entity-id";

export class Entity<T extends UnknownRecord = EmptyObject> {
  id: EntityId;

  props: T;

  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: EntityId,
    requiredProps: T,
    optionalProps?: { createdAt: Date; updatedAt: Date },
  ) {
    this.id = id;

    this.props = requiredProps;

    this.createdAt = optionalProps?.createdAt ?? new UTCDate();
    this.updatedAt = optionalProps?.updatedAt ?? new UTCDate();
  }
}
