import z from "zod";

export const updateDocumentRequestBodySchema = z.object({
  content: z.string().min(2).max(100000).optional(),
  projectId: z.ulid().nullable().optional(),
  title: z.string().min(2).max(256).optional(),
});
