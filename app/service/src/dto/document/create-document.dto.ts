import z from "zod";

export const createDocumentRequestBodySchema = z.object({
  content: z.string().min(2).max(100000),
  projectId: z.ulid().nullable(),
  title: z.string().min(2).max(256),
});
