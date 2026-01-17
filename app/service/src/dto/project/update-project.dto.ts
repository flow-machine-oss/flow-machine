import z from "zod";

export const updateProjectRequestBodySchema = z.object({
  name: z.string().min(1).max(256).optional(),
  key: z.string().min(1).max(64).optional(),
});
