import z from "zod";
import { tenantSchema } from "@/core/domain/tenant-aware-entity";

const tenantCtxSchema = z.object({
  tenant: tenantSchema,
});

export { tenantCtxSchema };
