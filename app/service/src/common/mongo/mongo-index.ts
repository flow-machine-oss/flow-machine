import type { IndexDescription } from "mongodb";

export const tenantAwareCollectionIndexes = [
  {
    key: { "tenant.id": 1, "tenant.type": 1 },
  },
] as const satisfies IndexDescription[];
