import z from "zod";
import { idSchema } from "@/lib/id";

export const updateIssueRequestBodySchema = z.object({
  projectId: idSchema.nullable().optional(),
});
