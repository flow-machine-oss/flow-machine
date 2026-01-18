import z from "zod";

export const createProjectRequestBodySchema = z.object({
  name: z.string().min(1).max(256),
  key: z.string().min(1).max(64),
});
