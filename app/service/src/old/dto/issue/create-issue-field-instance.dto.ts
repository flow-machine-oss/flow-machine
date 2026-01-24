import z from "zod";
import { idSchema } from "@/old/lib/id";

export const createIssueFieldInstanceRequestBodySchema = z.object({
  issueFieldDefinitionId: idSchema,
  value: z.string().optional(),
});
