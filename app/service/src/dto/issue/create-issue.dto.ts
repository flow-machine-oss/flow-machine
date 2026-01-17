import z from "zod";
import { idSchema } from "@/lib/id";

export const createIssueRequestBodySchema = z.object({
  projectId: idSchema.optional(),
});
