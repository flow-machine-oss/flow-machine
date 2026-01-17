import z from "zod";

export const updateIssueFieldInstanceRequestBodySchema = z.object({
  value: z.string().nullable().optional(),
});
