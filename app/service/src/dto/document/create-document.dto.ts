import z from "zod";
import { idSchema } from "@/lib/id";

export const createDocumentRequestBodySchema = z.object({
  content: z.string().min(2).max(100000),
  projectId: idSchema.nullable(),
  title: z.string().min(2).max(256),
});
