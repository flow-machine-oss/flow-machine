import z from "zod";

export const syncSchema = z.object({
  syncStatus: z.enum(["idle", "pending", "success", "error"]),
  syncedAt: z.date().nullable(),
});
