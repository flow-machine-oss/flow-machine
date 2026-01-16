import z from "zod";
import { idSchema } from "@/lib/id";

export const updateDocumentRequestBodySchema = z.object({
  content: z.string().min(2).max(100000).optional(),
  projectId: idSchema.nullable().optional(),
  title: z.string().min(2).max(256).optional(),
});
