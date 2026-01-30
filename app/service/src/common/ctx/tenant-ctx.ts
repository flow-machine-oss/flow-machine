import z from "zod";
import { tenantSchema } from "@/common/domain/tenant-aware-entity";

export const tenantCtxSchema = z.object({
  tenant: tenantSchema,
});
