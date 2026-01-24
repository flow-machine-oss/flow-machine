import { EmptyObject, UnknownRecord } from "type-fest";

export type WithOrganizationId<T extends UnknownRecord = EmptyObject> = T & {
  organizationId: string;
};
