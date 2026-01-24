import z from "zod";
import { idSchema } from "@/old/lib/id";

export const updateIssueRequestBodySchema = z.object({
  projectId: idSchema.nullable().optional(),
});
