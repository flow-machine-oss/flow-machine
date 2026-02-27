import z from "zod";
import { tenantSchema } from "@/core/domain/tenant-aware-entity";

export const tenantCtxSchema = z.object({
  tenant: tenantSchema,
});
