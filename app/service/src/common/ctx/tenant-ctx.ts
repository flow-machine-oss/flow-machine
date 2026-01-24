import z from "zod";

export const tenantCtxSchema = z.object({
  tenantId: z.string(),
});
